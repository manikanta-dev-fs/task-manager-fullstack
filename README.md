## Objective

This project was built as part of a Full Stack Developer Technical Assessment to demonstrate backend architecture, authentication security, database handling, frontend integration, and deployment strategy in a production-ready environment.# Task Manager Fullstack (Production-Ready)

A full-stack Task Manager application built with **Next.js 14 (App Router)**, **Node.js/Express**, and **MongoDB Atlas**. It provides secure JWT-based authentication with HTTP-only cookies and user-scoped task management with search, filtering, and pagination.

## Live Demo

- Frontend: https://task-manager-fullstack-zeta-rust.vercel.app
- Backend API: https://task-manager-backend-14ia.onrender.com
- Repository: https://github.com/manikanta-dev-fs/task-manager-fullstack

## Architecture Overview

The system follows a client-server-database architecture:

```text
[ Next.js Frontend ]
        |
        | HTTPS (Axios, withCredentials: true)
        v
[ Express API Server ]
  - Auth middleware (JWT from HTTP-only cookie)
  - Task controllers/services
  - Security middleware (mongo sanitize, centralized errors)
        |
        | Mongoose ODM
        v
[ MongoDB Atlas ]
  - users collection
  - tasks collection (user-scoped ownership)
```

Request flow:
1. User interacts with the frontend.
2. Frontend sends requests to backend APIs.
3. Backend authenticates, validates, and processes business logic.
4. Backend reads/writes MongoDB through Mongoose.
5. Backend returns structured JSON responses.
6. Frontend updates UI state.

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- Context API
- Axios
- Tailwind CSS
- Protected Routes

### Backend
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT Authentication (HTTP-only cookies)
- AES-256-CBC encryption for task descriptions
- express-mongo-sanitize for NoSQL injection protection
- Helmet security middleware
- Express rate limiting (global + auth)
- Joi request validation
- Health checks (`/health/live`, `/health/ready`)
- Pino structured logging with request IDs

## Folder Structure

```text
task-manager-fullstack/
+-- backend/
�   +-- src/
�   �   +-- config/          # Database connection
�   �   +-- controllers/     # Auth + Task controllers
�   �   +-- middleware/      # Auth + error middleware
�   �   +-- models/          # Mongoose models
�   �   +-- routes/          # API routes
�   �   +-- utils/           # JWT + encryption utilities
�   +-- server.js
�   +-- package.json
�   +-- .env
+-- frontend/
�   +-- src/
�   �   +-- app/             # App Router pages/layout
�   �   +-- components/      # UI components
�   �   +-- context/         # Auth context
�   �   +-- services/        # Axios API client
�   +-- package.json
�   +-- .env.local
+-- README.md
```

## Setup Instructions (Backend)

1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` and configure backend environment variables.
4. Run in development:
   ```bash
   npm run dev
   ```
5. Run in production:
   ```bash
   npm start
   ```

## Setup Instructions (Frontend)

1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` and configure frontend environment variables.
4. Run in development:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_jwt_secret
CLIENT_URL=http://localhost:3000
ENCRYPTION_KEY=32_character_secure_random_string
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## API Documentation

Base URL (production): `https://task-manager-backend-14ia.onrender.com`

### Auth Routes

#### `POST /api/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7890abc12",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### `POST /api/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "65f1a2b3c4d5e6f7890abc12",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### `POST /api/auth/logout`

Response (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### `GET /api/auth/me`

Response (200):
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7890abc12",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Task Routes (Protected)

#### `POST /api/tasks`

Request:
```json
{
  "title": "Prepare sprint report",
  "description": "Summarize completed work"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "65f1b2c3d4e5f67890abc123",
    "title": "Prepare sprint report",
    "description": "Summarize completed work",
    "completed": false,
    "status": "pending",
    "createdAt": "2026-02-26T10:00:00.000Z",
    "updatedAt": "2026-02-26T10:00:00.000Z"
  }
}
```

#### `GET /api/tasks?page=1&limit=10&status=pending&search=report`

Response (200):
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "totalPages": 1,
    "limit": 10
  }
}
```

#### `PUT /api/tasks/:id`

Request:
```json
{
  "title": "Prepare final sprint report",
  "status": "completed"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "65f1b2c3d4e5f67890abc123",
    "title": "Prepare final sprint report",
    "description": "Summarize completed work",
    "completed": true,
    "status": "completed",
    "createdAt": "2026-02-26T10:00:00.000Z",
    "updatedAt": "2026-02-26T10:05:00.000Z"
  }
}
```

#### `DELETE /api/tasks/:id`

Response (200):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Security Explanation

1. JWT in HTTP-only cookies to reduce token exposure to client-side scripts.
2. Secure cookie configuration in production (`secure`, `sameSite`).
3. AES-256-CBC encryption for task descriptions at rest.
4. NoSQL injection mitigation using `express-mongo-sanitize`.
5. Centralized error handling with production-safe stack behavior.
6. Startup-time environment variable validation (including encryption key length).
7. CORS restricted to configured client origin with credentials.
8. User-scoped task ownership enforcement for all task operations.

## Production Security & Observability

### Implemented Middleware and Controls

- `helmet` enabled for production-safe security headers.
- Global burst protection limiter enabled (`express-rate-limit`).
- Auth-specific limiter enabled on `/api/auth/*` to protect login/register endpoints.
- `express-mongo-sanitize` enabled for NoSQL injection mitigation.
- Request validation enabled with Joi for auth and task routes.
- Structured logging enabled with `pino`.
- Request correlation enabled via request IDs (`X-Request-Id`) on every response.

### Health Endpoints

- `GET /health/live`
  Returns service liveness.

- `GET /health/ready`
  Returns readiness status and verifies MongoDB connectivity (`ping`).

Example success response (`/health/live`):
```json
{
  "success": true,
  "status": "live",
  "uptime": 123.45,
  "timestamp": "2026-02-26T12:00:00.000Z"
}
```

Example success response (`/health/ready`):
```json
{
  "success": true,
  "status": "ready",
  "db": "connected"
}
```

## Deployment

### Frontend (Vercel)
- Deploy `frontend/` as a Next.js app.
- Configure `NEXT_PUBLIC_API_URL` with the Render backend URL.
- Live URL: https://task-manager-fullstack-zeta-rust.vercel.app

### Backend (Render)
- Deploy `backend/` as a Node.js service.
- Configure required env variables: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `ENCRYPTION_KEY`, `NODE_ENV`.
- Live URL: https://task-manager-backend-14ia.onrender.com

### Database (MongoDB Atlas)
- Managed cloud MongoDB cluster.
- Backend connects securely using environment-based URI.

## Future Improvements

1. Refresh token rotation and revocation strategy.
2. API rate limiting and abuse protection.
3. Schema-based request validation (Zod/Joi).
4. Automated test suite (unit/integration/e2e) with CI.
5. OpenAPI/Swagger documentation generation.
6. Soft delete and task activity/audit logs.
7. Advanced authorization policies for multi-role systems.

## Author

Manikanta  
GitHub: https://github.com/manikanta-dev-fs
