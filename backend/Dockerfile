# Production Dockerfile for Backend API Service
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install dependencies (only production deps)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose backend port
EXPOSE 3011

# Set production environment
ENV NODE_ENV=production
ENV PORT=3011

# Start production server
CMD ["node", "server.js"]
