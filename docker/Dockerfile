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
# Set environment variables
ARG SERVER_PORT_LISTENING
ENV SERVER_PORT_LISTENING=$SERVER_PORT_LISTENING

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ARG CORS_ALLOW_ORIGIN
ENV CORS_ALLOW_ORIGIN=$CORS_ALLOW_ORIGIN

ARG HOST_DB_CONFIG
ENV HOST_DB_CONFIG=$HOST_DB_CONFIG

ARG PORT_DB_CONFIG
ENV PORT_DB_CONFIG=$PORT_DB_CONFIG

ARG DIALECT_DB_CONFIG
ENV DIALECT_DB_CONFIG=$DIALECT_DB_CONFIG

ARG PROTOCOL_DB_CONFIG
ENV PROTOCOL_DB_CONFIG=$PROTOCOL_DB_CONFIG

ARG DATABASE_NAME_DB_CONFIG
ENV DATABASE_NAME_DB_CONFIG=$DATABASE_NAME_DB_CONFIG

ARG LOG_DEBUG_DB_CONFIG
ENV LOG_DEBUG_DB_CONFIG=$LOG_DEBUG_DB_CONFIG

ARG USER_NAME_DB_CONFIG
ENV USER_NAME_DB_CONFIG=$USER_NAME_DB_CONFIG

ARG USER_PASSWORD_DB_CONFIG
ENV USER_PASSWORD_DB_CONFIG=$USER_PASSWORD_DB_CONFIG
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
