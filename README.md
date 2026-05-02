📌 1 Million Checkboxes (Real-Time System)
🧠 Project Overview

This project is a real-time distributed web application where multiple users interact with a large grid of checkboxes. Any update made by one user is instantly reflected across all connected users using WebSockets.

The system is inspired by the “1 Million Checkboxes” concept and is designed to demonstrate real-time communication, Redis-backed shared state, rate limiting, and scalable backend architecture.

This implementation is a functional prototype of a real-time system, built to demonstrate core distributed system concepts under constrained development time.

⚙️ Tech Stack
Frontend
HTML
CSS (custom animated UI)
Vanilla JavaScript
Socket.IO client
Backend
Node.js
Express.js
Socket.IO
Redis (ioredis)
Architecture Concepts
Redis Pub/Sub
Event-driven architecture
Real-time WebSocket communication
Custom rate limiting logic
🚀 Features Implemented  
✅ Real-Time Communication System
Live checkbox synchronization across all connected clients
Socket.IO-based bidirectional event flow
✅ Backend API Layer
Express server handling HTTP and WebSocket traffic
/checkboxes endpoint for initial state hydration
/health endpoint for system monitoring
✅ Redis-Based State Management
Centralized checkbox state stored in Redis
Shared state consistency across clients
⚠️ Redis Pub/Sub Integration (partial scaling readiness)
Implemented event broadcasting mechanism
Designed with multi-instance scalability in mind (not fully deployed in distributed environment)
⚠️ Custom Rate Limiting
Redis-backed timestamp-based throttling
Prevents rapid repeated checkbox interactions per soc<img width="2828" height="1430" alt="Screenshot 2026-05-03 023230" src="https://github.com/user-attachments/assets/2b53d56d-c955-4531-a923-c73fedf3f4fb" />
ket
⚠️ Frontend UI
Fully styled interactive checkbox grid
Real-time visual updates via WebSocket events    
Error notification system for rate-limit feedback
❌ Known Limitations / Incomplete Areas (Important)

This project was developed under time constraints and iterative debugging challenges. While core functionality is working, several production-grade requirements remain incomplete:

❌ Authentication System
OAuth2 / OIDC flow not implemented
No JWT-based user authentication layer
Socket connections are not user-identitiy bound
❌ Scalable State Representation
Checkbox state stored as a JSON array in Redis
Not optimized for large-scale usage (1M+ nodes)
Redis bitmap approach (SETBIT / GETBIT) was not implemented
❌ Frontend Scalability Constraints
Entire checkbox grid is rendered directly in DOM
No virtualization or chunk-based rendering strategy
Not optimized for large-scale rendering workloads
❌ Advanced Rate Limiting Model
Current implementation is time-window based
No token bucket or sliding window algorithm
Rate limiting is tied to socket identifiers instead of authenticated users
❌ Multi-Instance Deployment Testing
Redis Pub/Sub architecture exists
However, distributed multi-server testing was not completed
🛠 How to Run Locally
1. Clone the repository
git clone <repo-url>
cd PR-Million-Checkboxes
2. Install dependencies
npm install
3. Start Redis server

Ensure Redis is running locally:

redis-server
4. Run backend server
node index.js
5. Open application
http://localhost:8000
🔐 Environment Variables

Create a .env file:

PORT=8000
REDIS_URL=redis://localhost:6379
🧱 Redis Setup
Option 1: Local installation
sudo apt install redis-server
redis-server
Option 2: Docker
docker run -p 6379:6379 redis
🔄 Authentication Flow (Planned Design — Not Implemented)
Intended Architecture:
User authenticates via OAuth2 / OIDC provider
Backend issues JWT token
Client includes token in Socket.IO handshake
Server validates token before allowing interactions
User identity replaces socket-based identification
Current State:
Authentication layer not implemented
Socket communication operates without user identity binding
🔌 WebSocket Communication Flow
Client establishes Socket.IO connection
Server registers connection
User toggles checkbox

Client emits:

client:checkbox:change
Server:
Updates Redis state
Publishes update via Redis Pub/Sub

All connected clients receive:

server:checkbox:change
UI updates in real time
⏱ Rate Limiting Logic
Current Implementation:
Each socket stores last action timestamp in Redis
Server validates time difference before accepting new action
Enforces minimum delay (~3.5 seconds per socket)
Limitations:
Based on socket ID instead of authenticated user
Can be bypassed through reconnection
Not a production-grade distributed rate limiting system
📸 Screenshots / Demo

<img width="2828" height="1430" alt="Screenshot 2026-05-03 023230" src="https://github.com/user-attachments/assets/aff7b280-69d5-4478-b72a-4314fb910933" />

<img width="2826" height="1414" alt="Screenshot 2026-05-03 023243" src="https://github.com/user-attachments/assets/6b3cc5f7-ed01-4e56-955d-d810f2ed3a55" />



Checkbox grid UI
Real-time updates across tabs
Error notification system
🧭 Final Notes

This project demonstrates working knowledge of:

Real-time WebSocket systems
Redis-based shared state coordination
Event-driven backend architecture
Basic distributed system design patterns

During development, multiple iterations were attempted. However, the system encountered stability issues and crashes during refinement of scaling and synchronization logic. As a result, the final submission represents a stable working version rather than a fully optimized large-scale implementation.

Despite these constraints, the core objectives of real-time communication, state synchronization, and backend coordination were successfully achieved.

📌 Personal Reflection

The implementation was developed during the early phase of participation in the ChaiCode Web Development Cohort 2026. Due to late onboarding and iterative debugging challenges, full optimization of all planned features could not be completed within the available timeframe. However, the project reflects a strong foundational understanding of real-time systems and serves as a stepping stone toward more advanced distributed system implementations.
