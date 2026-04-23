# Stage 1: Build
FROM node:20-alpine AS builder

# Install build tools needed for native modules (e.g., node-canvas)
RUN apk add --no-cache libc6-compat python3 make g++ pkgconfig \
    pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev

WORKDIR /app
COPY package*.json ./
# Use npm ci for more reliable builds in Docker
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# -------------------------------
# Stage 2: Production
# -------------------------------
FROM node:20-alpine
WORKDIR /app

# 1. We MUST keep python3 and build tools for npm install to succeed 
# for native modules like 'canvas'.
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev

COPY package*.json ./
COPY prisma ./prisma/

# 2. Install production dependencies
RUN npm install --omit=dev
RUN npx prisma generate

# 3. Copy compiled NestJS code from the builder stage
COPY --from=builder /app/dist ./dist

# 4. (Optional but Recommended) Remove build-only tools after install 
# to keep the image lean, but keep the shared libraries (.so files)
# If you want to be safe, just leave the apk add above as is.

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/src/main.js"]