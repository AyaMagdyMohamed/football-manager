# ⚽ Football Online Manager API (NestJS)

Backend API for an online football manager system where users manage teams, buy and sell players, and interact with a transfer market.

Built with clean architecture, async processing, caching, and transaction-safe operations.

---

##  Tech Stack

- **NestJS** (Node.js framework)
- **PostgreSQL** (database)
- **TypeORM** (ORM)
- **Redis** (caching & background jobs)
- **BullMQ** (async job queue)
- **Docker & Docker Compose**
- **Swagger (OpenAPI)** for API documentation

---

##  Features

- User registration & login (JWT authentication)
- Automatic team creation (async background job)
- Player management
- Transfer market:
  - Sell players with price validation
  - Buy players (transaction-safe)
  - Filters (name, position, price range, team)
- Business rules:
  - Teams must always have **15–25 players**
  - Buying price = **95%** of asking price
- Redis caching for transfer market
- Safe concurrency using database transactions & row locking

---

##  Setup using Docker (Recommended)

### 1. Build and run containers


docker compose up --build


---
### 2. API will be available at
http://localhost:3000

---

### 3. Swagger API Documentation

http://localhost:3000/api


## Local Setup (without Docker)

### 1. Install dependencies
npm install

### 2. Create a .env file:
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=fantasy

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=secret123

### 3. Start API

npm run start:dev


## Useful Endpoints

| Feature         | Endpoint               |
| --------------- | ---------------------- |
| Signup          | `POST /auth/authenticate`    |
| Login           | `POST /auth/authenticate`     |
| Sell player     | `POST /transfers/sell` |
| Buy player      | `POST /transfers/buy`  |
| team          | `GET /team/me`           |
| Transfer market | `GET /transfers`       |


All protected routes require:

Authorization: Bearer <JWT_TOKEN>


## Development Time Tracking

| Day       | Tasks Completed                                                                                                  | Hours |
|-----------|-------------------------------------------------------------------------------------------------------------------|-------|
| Monday    | Project setup, NestJS structure, database schema design (User, Team, Player), authentication (login/signup), JWT, TypeORM integration | 2     |
| Tuesday   | Transfer market APIs (sell & buy), business validations, transaction handling                                     | 2     |
| Thursday  | Caching layer (generic cache interface + Redis), BullMQ integration for team creation                             | 2     |
| Saturday  | Swagger documentation, transfer market filters, bug fixes, Docker setup, testing & final cleanup                 | 3     |
| **Total** |                                                                                                                   | **11**|










