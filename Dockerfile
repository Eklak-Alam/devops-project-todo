# Stage 1: Build the app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (for dependency caching)
COPY package*.json ./

# Set npm registry explicitly (fixes ECONNRESET issues sometimes)
RUN npm config set registry https://registry.npmjs.org/

# Install deps
RUN npm install --no-audit --prefer-offline

# Copy source code
COPY . .

# Ensure correct postcss version
RUN npm install postcss@latest

# Build the app
RUN npm run build


# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

# Copy only built app + node_modules from builder
COPY --from=builder /app ./

# Remove dev dependencies (keep only prod)
RUN npm prune --production && npm cache clean --force

EXPOSE 3000

CMD ["npm", "start"]
