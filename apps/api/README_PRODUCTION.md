Production notes for `apps/api`:

Environment variables required:
- NODE_ENV=production
- PORT=4000
- API_PREFIX=/api/v1
- MONGODB_URI=mongodb://mongo:27017/jobboard
- REDIS_URL=redis://redis:6379
- REDIS_HOST=redis
- REDIS_PORT=6379
- JWT_ACCESS_SECRET=your-secret
- JWT_REFRESH_SECRET=your-refresh-secret
- LOG_LEVEL=info
- SENTRY_DSN (optional)

Recommended run steps (Docker):
1. Build monorepo and web: `pnpm -w build`
2. Build Docker images: `docker compose build`
3. Start services: `docker compose up -d`

Backup:
- Use `pnpm backup:mongo` which wraps `mongodump` (requires mongodump installed on host).

Health endpoints:
- `/health` basic liveness
- `/ready` readiness check (MongoDB + Redis)
