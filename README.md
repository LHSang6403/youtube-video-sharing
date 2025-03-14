# YouTube Video Sharing App

## Introduction

This repository contains a **YouTube Video Sharing App** with both **Backend** (NestJS + Prisma) and **Frontend** (Next.js). The application allows users to:

- **Register** and **Login** with hashed passwords.
- **Share YouTube videos** (saved to a PostgreSQL database).
- **View a list of shared videos** (includes thumbnail previews).
- **Receive real-time notifications** (Socket.IO) whenever a new video is shared.
- **Cache data** (optional) using Redis for performance.
- **Comprehensive testing** (unit tests and integration tests).

### Key Features

1. **User Authentication**: Secure registration and login (JWT + bcrypt).
2. **Video Sharing**: Store YouTube video info in PostgreSQL.
3. **Real-time Notif[i](http://Socket.IO)cations**: Socket.IO sends alerts about newly shared videos.
4. **Redis Caching** (Optional): Speeds up fetching frequently accessed data.
5. **Full Testing**: Unit tests (services, resolvers) and integration tests (end-to-end).

## Prerequisites

- **Node.js**: v20.15.1 or later recommended.
- **npm**: v8 or later, or **Yarn** if you prefer.
- **PostgreSQL**: v14+ recommended (or a Docker container).
- **Redis**: v7+ recommended (if you enable caching).
- **Docker** (optional for containerized deployment): v20+ recommended.

## Installation & Configuration

1. **Clone the repository**:

   ```
   1. `git clone https://github.com/your-username/youtube-video-sharing-app.git cd youtube-video-sharing-app`
   ```

2. **Install dependencies** (both backend & frontend):

   ```
   `# In the root, or each directory if separated cd backend npm install cd ../frontend npm install`
   ```

3. **Configure environment variables**:

   - **Backend**: Create a `.env` file in `backend/`:

     ```
     dotenv
     ```

     Copy

     `PORT=4000 CORS_ORIGIN=http://localhost:3000 JWT_SECRET=supersecretkey JWT_EXPIRES_IN=1h DATABASE_URL="postgresql://username:password@localhost:5432/your_database?schema=public" REDIS_HOST=localhost REDIS_PORT=6379`
   - **Frontend**: Create a `.env.local` in `frontend/`:

     ```
     dotenv
     ```

     Copy

     `NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql NEXT_PUBLIC_SOCKET_ENDPOINT=http://localhost:4000`

## Database Setup

1. **Install PostgreSQL** (or use Docker container).
2. **Create a database** named `your_database`.
3. **Migrate & Generate Prisma client**:

   ```
   bash
   ```

   Copy

   `cd backend npx prisma migrate dev --name init npx prisma generate`
4. **Seed data** (optional):

   ```
   bash
   ```

   Copy

   `npx ts-node prisma/seed.ts`

    (Adjust the command as needed if you have a custom seed script.)

## Running the Application

### 1\. Start Backend

```
bash
```

Copy

`cd backend npm run start:dev`

- Runs NestJS server on `http://localhost:4000`.
- GraphQL endpoint at `http://localhost:4000/graphql`.

### 2\. Start Frontend

```
bash
```

Copy

`cd frontend npm run dev`

- Runs Next.js on `http://localhost:3000`.

### 3\. Run Tests

#### Unit Tests

```
bash
```

Copy

`# In the backend folder npm run test`

- Looks for `.spec.ts` files in services, resolvers, etc.

#### Integration / E2E Tests

```
bash
```

Copy

`npm run test:e2e`

- Spawns a test environment for end-to-end testing (GraphQL queries, etc.).

## Docker Deployment

### 1\. Docker Compose

We provide a sample `docker-compose.yml` that includes **PostgreSQL** and optionally **Redis**. For example:

```
yaml
```

Copy

`version: '3.8' services: postgres: image: postgres:14-alpine environment: POSTGRES_USER: username POSTGRES_PASSWORD: password POSTGRES_DB: your_database ports: - '5432:5432' volumes: - postgres_data:/var/lib/postgresql/data redis: image: redis:7-alpine ports: - '6379:6379' volumes: - redis_data:/data volumes: postgres_data: redis_data:`

Start services:

```
bash
```

Copy

`docker-compose up -d`

### 2\. Build Backend Docker Image

```
bash
```

Copy

`cd backend docker build -t your-backend-image . docker run -p 4000:4000 your-backend-image`

### 3\. Build Frontend Docker Image

```
bash
```

Copy

`cd frontend docker build -t your-frontend-image . docker run -p 3000:3000 your-frontend-image`

### 4\. Environment Variables

Remember to pass or define environment variables (e.g. `DATABASE_URL`) in your Dockerfiles or Docker Compose.