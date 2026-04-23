# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We generate here just to satisfy the build script if it needs it
RUN npx prisma generate
RUN npm run build

# -------------------------------
# Stage 2: Production
# -------------------------------
FROM node:20-alpine
# Required for Prisma to run on Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. Copy dependencies and install only production ones
COPY package*.json ./
RUN npm install --omit=dev

# 2. Copy the Prisma schema (essential for generation)
COPY --from=builder /app/prisma ./prisma

# 3. Generate the Prisma Client specifically for this environment
RUN npx prisma generate

# 4. Copy the compiled NestJS code
COPY --from=builder /app/dist ./dist


ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/src/main.js"]