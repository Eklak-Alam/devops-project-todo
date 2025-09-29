FROM node:18-alpine

WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
RUN npm ci

# Copy all files
COPY . .

# Install specific postcss version to fix the issue
RUN npm install postcss@latest

# Generate build without turbopack
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]