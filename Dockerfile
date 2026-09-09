# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=frontend-builder /app/dist ./public_html
COPY --from=frontend-builder /app/server ./server
COPY --from=frontend-builder /app/src/data ./src/data

# Ensure data directory exists for SQLite
RUN mkdir -p /app/server/data

EXPOSE 5000

CMD ["node", "server/index.js"]
