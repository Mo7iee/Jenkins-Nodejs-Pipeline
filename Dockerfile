FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/index.js"]


# # multi-stage
# FROM node:20 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY tsconfig.json ./
# COPY src ./src
# # Build TypeScript to JavaScript
# RUN npm run build
# # ===== Stage 2: Production Stage =====
# FROM node:20-slim
# # Set working directory
# WORKDIR /app
# # Copy only package files and install production dependencies
# COPY package*.json ./
# RUN npm install --only=production
# # Copy the compiled JS from the build stage
# COPY --from=build /app/dist ./dist
# # Expose the port your app listens on
# EXPOSE 3000
# # Start the app
# CMD ["node", "dist/index.js"]
