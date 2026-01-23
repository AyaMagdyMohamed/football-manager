# Football Online Manager API (NestJS)

This repository provides the project structure and Dockerized setup for the Football Online Manager challenge.

## Tech Stack
- NestJS (Node.js)
- PostgreSQL
- Docker / Docker Compose

## Setup (Docker)


1. Build and run:
   ```bash
   docker compose up --build
   ```
2. API will be available at: `http://localhost:3000`

## Setup (Local)
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start API:
   ```bash
   npm run start:dev
   ```


## Notes
- Team creation is expected to be handled asynchronously (separate process/job).
- Teams must always keep 15–25 players.
