# Multi-stage build for monorepo
FROM node:20-alpine AS deps
WORKDIR /work

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml ./
COPY ./.npmrc ./.npmrc
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

# Install all dependencies at workspace root for deterministic installs
RUN pnpm install --frozen-lockfile

# Build all packages (turbo)
COPY . .
RUN pnpm build

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built workspace
COPY --from=deps /work/ .

# Expose default API port
EXPOSE 4000

# Default command runs API server
CMD ["node", "apps/api/dist/server.js"]
