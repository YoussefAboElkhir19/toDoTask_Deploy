# Multi-stage build for frontend
FROM node:18 AS client-builder
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY client ./
RUN npm run build

# Backend stage
FROM node:18
WORKDIR /app

# Copy server dependencies
COPY server/package.json server/package-lock.json* ./
RUN npm install

# Copy server source code
COPY server ./

# Copy built frontend to serve static files (optional)
COPY --from=client-builder /app/client/build ./public

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

CMD ["node", "index.js"]
