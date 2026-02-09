# Production Build for Frontend
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

# Copy production files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose frontend port
EXPOSE 3000

CMD ["npm", "run", "start"]
