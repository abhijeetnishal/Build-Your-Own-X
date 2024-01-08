# Stage 1: Build TypeScript
FROM node:18-alpine AS build

WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY package*.json ./
RUN npm ci

# Copy the entire project and build TypeScript
COPY . .
RUN npm run build

# Stage 2: Create minimal production image
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/.env ./

# Install only production dependencies
RUN npm ci --production

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "/app/dist/index.js"]
