# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder
# Added python and build tools here for the initial npm install
RUN apk add --no-cache libc6-compat python3 make g++ pkgconfig \
    pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# -------------------------------
# Stage 2: Production
# -------------------------------
FROM node:20-alpine
WORKDIR /app

# 1. Install system dependencies for 'canvas' and 'prisma'
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

# 2. Copy package files
COPY package*.json ./

# 3. CRITICAL: Copy the prisma folder BEFORE npm install 
# This prevents the 'postinstall' prisma generate script from failing
COPY prisma ./prisma/

# 4. Install production dependencies
# Adding --ignore-scripts is an alternative if you want to skip the postinstall
RUN npm install --omit=dev

# 5. Generate the Prisma Client
RUN npx prisma generate

# 6. Copy the compiled NestJS code from the builder stage
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/src/main.js"]