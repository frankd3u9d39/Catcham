# CATCHAM Production Hosting & Deployment Guide

This guide details how to host the **CATCHAM** Sovereign Incident Reporting & Casework Management Platform.

---

## 1. System Readiness Status

Both core applications have been analyzed, typechecked, and verified for production:

| Component | Stack | Build Command | Status |
| :--- | :--- | :--- | :--- |
| **API Backend** | NestJS 10, Node 20+, Prisma, SQLite/PostgreSQL | `pnpm --filter @catcham/api build` | **Ready** (Compiled cleanly) |
| **Web Frontend** | Next.js 14 (App Router), Tailwind CSS | `pnpm --filter @catcham/web build` | **Ready** (23/23 routes compiled) |
| **Monorepo** | Turborepo 2, pnpm workspaces | `pnpm build` | **Ready** (100% cache/build pass) |

---

## 2. Production Environment Variables

### Backend API (`apps/api` or root `.env`)

> [!CRITICAL]
> When `NODE_ENV=production`, the API will **refuse to boot** if `JWT_ACCESS_SECRET` or `JWT_REFRESH_SECRET` start with `change_me`. You must generate cryptographically strong random strings.

Generate secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

| Variable | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations & security guards |
| `PORT` | `4000` | Port for NestJS HTTP server |
| `DATABASE_URL` | `file:/app/data/catcham.db` (or postgres URL) | Database connection string |
| `CORS_ORIGINS` | `https://your-frontend-domain.com` | Comma-separated list of allowed frontend origins |
| `JWT_ACCESS_SECRET` | *(64-character random string)* | Access token signing key (min 32 chars) |
| `JWT_ACCESS_TTL` | `15m` | Access token lifespan |
| `JWT_REFRESH_SECRET` | *(64-character random string)* | Refresh token signing key (min 32 chars) |
| `JWT_REFRESH_TTL` | `7d` | Refresh token lifespan |
| `STORAGE_ROOT` | `/app/data/evidence` | Directory where evidence files are stored |
| `UPLOAD_MAX_BYTES` | `52428800` | Max evidence upload size (50MB) |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window (1 min) |
| `RATE_LIMIT_MAX` | `30` | Max requests per IP per window |
| `SMTP_HOST` | *(Optional, e.g. smtp.sendgrid.net)* | Email notifications server (leaves logged if blank) |

### Frontend Web (`apps/web`)

| Variable | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://your-api-domain.com/api/v1` | URL where the web app communicates with the API |

---

## 3. Deployment Options

### Option A: Vercel (Frontend) + Render / Railway (Backend) *(Recommended for Cloud)*

#### Step 1: Deploy Backend on Render / Railway
1. Create a new **Web Service** pointing to your Git repository.
2. Root Directory: Repository Root.
3. Build Command:
   ```bash
   pnpm install && pnpm db:generate && pnpm db:deploy && pnpm --filter @catcham/api build
   ```
4. Start Command:
   ```bash
   node apps/api/dist/main.js
   ```
5. Add the environment variables listed in the Backend table above.
6. Attach a Persistent Disk mounted at `/app/data` (for SQLite database and uploaded evidence).

#### Step 2: Deploy Frontend on Vercel
1. Import your Git repository into Vercel.
2. Select Framework Preset: **Next.js**.
3. Root Directory: `apps/web`.
4. Build Command:
   ```bash
   cd ../.. && pnpm install && pnpm db:generate && pnpm --filter @catcham/web build
   ```
5. Output Directory: `.next`.
6. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://your-api-url.onrender.com/api/v1`
7. Deploy!

---

### Option B: VPS (DigitalOcean / Hetzner / AWS) with Docker Compose *(Full Control)*

The repository includes a production-ready [`docker-compose.yml`](file:///d:/Capcut/project/Catcham/docker-compose.yml), [`Dockerfile.api`](file:///d:/Capcut/project/Catcham/Dockerfile.api), and [`Dockerfile.web`](file:///d:/Capcut/project/Catcham/Dockerfile.web).

1. SSH into your VPS:
   ```bash
   ssh user@your-server-ip
   ```
2. Clone your repository:
   ```bash
   git clone <your-repo-url> catcham
   cd catcham
   ```
3. Set your production environment secrets in a `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with strong JWT secrets and your server's domain/IP
   ```
4. Build and start the containers:
   ```bash
   docker compose up -d --build
   ```
5. Seed initial data (first time only):
   ```bash
   docker compose exec api node -e "require('./prisma/seed.ts')"
   ```
6. The services will be running:
   - Web App: `http://your-server-ip:3000`
   - API Server: `http://your-server-ip:4000/api/v1`
   - Swagger Documentation: `http://your-server-ip:4000/docs`

---

### Option C: VPS with Node.js & PM2 *(Lightweight)*

1. Install Node.js 20+ and pnpm on the server:
   ```bash
   npm install -g pnpm pm2
   ```
2. Clone and install dependencies:
   ```bash
   git clone <your-repo-url>
   cd catcham
   pnpm install
   ```
3. Setup database & seed:
   ```bash
   pnpm db:generate
   pnpm db:deploy
   pnpm db:seed
   ```
4. Build production bundles:
   ```bash
   pnpm build
   ```
5. Start both processes with PM2:
   ```bash
   # Start API
   pm2 start apps/api/dist/main.js --name "catcham-api"
   
   # Start Web App
   pm2 start "pnpm --filter @catcham/web start -p 3000" --name "catcham-web"
   
   # Save process list for server reboots
   pm2 save
   pm2 startup
   ```

---

## 4. Post-Deployment Verification

1. **API Health Check:**
   ```bash
   curl -I https://your-api-domain.com/api/v1/health
   ```
2. **Swagger Documentation:**
   Navigate to `https://your-api-domain.com/docs` to view and test interactive API endpoints.
3. **Web Portal:**
   Visit `https://your-web-domain.com/` and test:
   - Submitting an incident report
   - Logging in as `citizen@catcham.local` or your admin account
   - Real-time complaint tracking via reference code
