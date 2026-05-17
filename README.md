# PathFindr — Career Counseling Platform

A full-stack career counseling platform connecting students with expert counselors. Features AI-powered career assessments, Razorpay payments, Daily.co video sessions, and real-time chat.

---

## Tech Stack

| Layer        | Technology                                               |
|-------------|----------------------------------------------------------|
| **Frontend** | React 19, Vite, Tailwind CSS, Zustand, Framer Motion     |
| **Backend**  | Node.js, Express 5, Prisma 7, PostgreSQL (Supabase)      |
| **Payments** | Razorpay                                                 |
| **Video**    | Daily.co                                                 |
| **Chat**     | Socket.io                                                |
| **Deploy**   | Docker, Nginx, PM2, GitHub Actions CI/CD                  |

---

## Project Structure

```
Counsellor/
├── pathfindr-backend/          # Express API server
│   ├── src/
│   │   ├── app.js              # Express app configuration
│   │   ├── server.js           # Server entry point
│   │   ├── config/db.js        # Prisma client
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/          # Auth, request ID
│   │   ├── routes/             # API routes
│   │   ├── socket/             # Socket.io handlers
│   │   └── utils/              # Logger, validators, AppError
│   ├── prisma/schema.prisma    # Database schema
│   ├── Dockerfile
│   ├── ecosystem.config.js     # PM2 config
│   └── .env.example
├── pathfindr-frontend/         # React SPA
│   ├── src/
│   │   ├── api/axios.js        # API client
│   │   ├── components/         # UI components
│   │   ├── pages/              # Page components
│   │   ├── routes/             # Router
│   │   └── store/              # Zustand stores
│   ├── Dockerfile
│   ├── nginx.conf              # Production Nginx config
│   └── .env.example
├── docker-compose.yml
└── .github/workflows/ci.yml   # CI/CD pipeline
```

---

## Quick Start (Development)

### Prerequisites
- Node.js >= 18
- PostgreSQL database (or Supabase account)
- npm

### 1. Clone & Install

```bash
# Backend
cd pathfindr-backend
cp .env.example .env        # Fill in your values
npm install
npx prisma generate
npx prisma db push          # Sync schema to DB
npm run db:seed             # Optional: seed data

# Frontend
cd ../pathfindr-frontend
cp .env.example .env        # Fill in your values
npm install
```

### 2. Configure Environment

**Backend `.env`** — Required:
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooler) |
| `DIRECT_URL` | PostgreSQL direct connection |
| `JWT_SECRET` | Strong random secret (min 32 chars) |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `DAILY_API_KEY` | Daily.co API key |

**Frontend `.env`**:
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_SOCKET_URL` | Socket.io server URL |

### 3. Run

```bash
# Terminal 1 — Backend
cd pathfindr-backend
npm run dev

# Terminal 2 — Frontend
cd pathfindr-frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Production Deployment

### Option A: Docker Compose

```bash
# From project root
docker-compose up -d --build
```

This starts:
- **Backend** on port `5000` (health check at `/healthz`)
- **Frontend** (Nginx) on port `80` with API reverse proxy

### Option B: PM2 (Backend Only)

```bash
cd pathfindr-backend
npm run start:pm2
```

Uses cluster mode across all CPU cores with auto-restart.

### Option C: Manual

```bash
# Backend
cd pathfindr-backend
NODE_ENV=production npm start

# Frontend — build static assets
cd pathfindr-frontend
npm run build
# Serve dist/ with Nginx or any static host
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | Bearer | Get current user |
| GET | `/api/assessment/questions` | Bearer | Get questions |
| POST | `/api/assessment/submit` | Bearer | Submit assessment |
| GET | `/api/assessment/status` | Bearer | Assessment status |
| POST | `/api/bookings/create` | Bearer | Create booking |
| POST | `/api/bookings/verify` | Bearer | Verify payment |
| GET | `/api/bookings/my-bookings` | Bearer | List bookings |
| GET | `/api/bookings/:id` | Bearer | Get booking |
| GET | `/api/counselors` | — | List counselors |
| GET | `/api/counselors/:id` | — | Get counselor |
| GET | `/api/chat/history/:bookingId` | Bearer | Chat history |
| GET | `/api/resources` | — | List resources |
| GET | `/api/resources/:id` | — | Get resource |
| GET | `/healthz` | — | Liveness check |
| GET | `/readyz` | — | Readiness check |

---

## Security Features

- **Helmet** — Secure HTTP headers + CSP
- **CORS** — Strict origin whitelist
- **Rate Limiting** — 100 req/15min (API), 10 req/15min (auth)
- **Zod Validation** — Schema validation on all inputs
- **XSS Protection** — Input sanitization
- **HPP** — HTTP parameter pollution prevention
- **JWT Auth** — No fallback secrets, token expiration handling
- **Razorpay Signature** — HMAC-SHA256 verification
- **Socket.io Auth** — JWT handshake required
- **Error Masking** — No stack traces in production
- **Request IDs** — Distributed tracing via `X-Request-ID`

---

## Monitoring

- **Health**: `GET /healthz` (liveness), `GET /readyz` (DB connectivity)
- **Logging**: Structured JSON logs via Winston (file + console)
- **PM2**: Built-in process monitoring, CPU/memory metrics
- **Docker**: Container health checks with auto-restart

---

## CI/CD

GitHub Actions pipeline (`.github/workflows/ci.yml`):
1. **On push/PR**: Lint, audit, test, build
2. **On main push**: Build Docker images → push to Docker Hub

Required GitHub Secrets:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

---

## License

ISC
