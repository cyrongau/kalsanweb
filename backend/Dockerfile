# Production Build for Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Generate build
RUN npm run build

# --- Production Setup ---
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/uploads ./uploads

# Expose backend port
EXPOSE 3001

CMD ["npm", "run", "start:prod"]
