## Introduction

A **NestJS + Prisma** backend and **Next.js** frontend for:

- **Register/Login** (JWT, bcrypt)
- **Share YouTube videos** (PostgreSQL)
- **Real-time notifications** (Socket.IO)
- **Optional caching** (Redis)
- **Comprehensive testing** (unit + e2e)

## Prerequisites

- **Node.js** (≥ v20.15.1)
- **npm** (≥ v8) or Yarn
- **PostgreSQL** (v14+)
- **Redis** (v7+) (optional)
- **Docker** (v20+) (optional)

## Installation & Config

1. **Clone**:

   `git clone https://github.com/your-username/youtube-video-sharing-app.git `

   `cd youtube-video-sharing-app`
2. **Install**:

   `cd backend && npm install cd ../frontend && npm install`
3. Prepare env:

In each direectory, copy env from env.example to .env file.

## Database Setup

1. Create a **PostgreSQL** database:

   `cd backend`

   `docker-compose up -d`
2. **Migrate** & **generate**:

   `cd backend`

   `npx prisma migrate dev --name init`

   `npx prisma generate`
3. **Seed** (optional):

   `npx ts-node prisma/seed.ts`

## Running the App

1. **Backend**:

   `cd backend`

   `npm run start:dev`
   - Runs at `http://localhost:4000`
   - GraphQL at `/graphql`
2. **Frontend**:

   `cd frontend`

   `npm run dev`
   - Runs at `http://localhost:3000`

## Testing

- **Unit** (backend):

  `cd backend`

  `npm run test`
- **Integration/E2E**:

  `npm run test:e2e`