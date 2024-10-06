# ---- Base Node ----
FROM node:21 AS base
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY cypress*.json ./
# Set npm to production mode
RUN npm install -g npm@10.3.0
# Install app dependencies - this stage will cache these layers for faster builds
RUN npm ci

# ---- Build ----
# Compile typescript into javascript
FROM base AS build
WORKDIR /app

COPY . .
RUN npm run build

# ---- Release ----
# Create an optimized version for production without development dependencies
FROM base AS release
COPY --from=build /app/dist /app/dist
# in Dockerfile
RUN npm install -g @nestjs/cli
# This will remove devDependencies from node_modules
RUN npm prune --production

# run the app in production mode
CMD [ "npm", "run", "start" ]
