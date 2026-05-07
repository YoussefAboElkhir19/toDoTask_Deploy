# Cloud App

This project has two parts:

- `client` - React frontend
- `server` - Express API with MongoDB and full CRUD for todos

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose if you want to run the full stack in containers

## Run Locally

### 1. Start the frontend

```bash
cd client
npm install
npm start
```

The frontend runs on `http://localhost:3000`.

### 2. Start the backend

```bash
cd server
npm install
node index.js
```

The backend runs on `http://localhost:5000`.

### 3. MongoDB note

The server connects to `mongodb://mongo:27017/testdb`, which is the Docker service name used by `docker-compose.yml`.

If you run the server outside Docker, you need MongoDB available locally or you must update the `MONGO_URI` environment variable.

## Backend Structure

- `server/index.js` - app bootstrap and route mounting
- `server/config/db.js` - MongoDB connection with retry logic
- `server/models/Todo.js` - Todo schema
- `server/routes/todos.js` - CRUD API routes

## Todo API

- `GET /api/todos` - list todos
- `GET /api/todos/:id` - get one todo
- `POST /api/todos` - create todo
- `PUT /api/todos/:id` - update todo title or completion state
- `DELETE /api/todos/:id` - delete todo

## Run With Docker

From the project root:

```bash
docker compose up --build
```

If your Docker installation uses the older command format, this also works:

```bash
docker-compose up --build
```

This starts:

- Frontend on `http://localhost:3000`
- Backend on `http://localhost:5000`
- MongoDB on `localhost:27017`

## Stop Docker

```bash
docker compose down
```

## Useful Commands

```bash
# Rebuild and start everything
docker compose up --build

# Stop containers
docker compose down

# Start frontend only
cd client && npm start

# Start backend only
cd server && node index.js
```
