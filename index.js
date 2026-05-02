import http from 'http';
import path from 'node:path';

import express from 'express';
import { Server} from 'socket.io';

import Redis from 'ioredis';
import {publisher, subscriber, redis} from './redis-connection.js'

const CHECKBOX_SIZE = 100;
const CHECKBOX_STATE_KEY = 'checkbox-state:v1'
const rateLimitingHashMap = new Map()



async function main(){
    const app = express();
    const server = http.createServer(app);
    const PORT = process.env.PORT ?? 8000
    const io = new Server(server);

    await subscriber.subscribe('internal-server:checkbox:change');
    subscriber.on('message', (channel, message) => {
        if(channel === 'internal-server:checkbox:change'){
            const {index, checked} = JSON.parse(message);
            io.emit('server:checkbox:change', {index, checked});
        }
    });

    // Socket.IO 
    io.on('connection', (socket) => {
        // OIDC Authentication - user.sub to be then used instead of ${socket.id}
        console.log(`Socket connected`, {id:socket.id});

        socket.on('client:checkbox:change', async (data) => {
        console.log(`[Socket:${socket.id}]:client:checkbox:change`, data);

        
        const lastOperationTime = await redis.get(`rate-limiting:${socket.id}`)
        if(lastOperationTime){
            const timeElapsed = Date.now() - lastOperationTime
            if (timeElapsed < 3.5* 1000){
                socket.emit('server:error', {error : 'Too fast, slow down'})
            return
            }
        }
        await redis.set(`rate-limiting:${socket.id}`, Date.now());


        const existingState = await redis.get(CHECKBOX_STATE_KEY);

        if(existingState){
            const remoteData = JSON.parse(existingState);
            remoteData[data.index] = data.checked;
            await redis.set(CHECKBOX_STATE_KEY,JSON.stringify(remoteData));
        }else{
            await redis.set(
                CHECKBOX_STATE_KEY,
                JSON.stringify(new Array(CHECKBOX_SIZE).fill(false)),
            );
        }
        await publisher.publish(
            'internal-server:checkbox:change',
            JSON.stringify(data),
        );
    });
});

    // Express
    app.use(express.static(path.resolve('./public')));// allowing users to get access to files in 'Public'
    app.get('/health', (req, res) => res.json({healthy:true}));

    app.get('/checkboxes', async (req, res) => {
        const existingState = await redis.get(CHECKBOX_STATE_KEY);
        if(existingState){
            const remoteData = JSON.parse(existingState);
            return res.json({checkboxes: remoteData})
        }
        return res.json({ checkboxes: new Array(CHECKBOX_SIZE).fill(false) });
    });

    server.listen(PORT,()=> {
        console.log(`Server is running on http://localhost:${PORT}`);
        
    })
}
main();