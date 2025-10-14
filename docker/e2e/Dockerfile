FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Set environment to test
ENV NODE_ENV=test

# Expose port
EXPOSE 3000

# Command to run tests
CMD ["npm", "run", "test:e2e"]