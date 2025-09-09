# syntax=docker/dockerfile:1

# --- Base image (Debian slim for best native lib compatibility: sharp, bcrypt, etc.)
FROM node:20-bookworm-slim
WORKDIR /app

# lightweight init for proper signal handling
# RUN apt-get update && apt-get install -y --no-install-recommends dumb-init \
#   && rm -rf /var/lib/apt/lists/*

# --- Dependencies stage (has build tools for any native modules)
# FROM base AS deps
# RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
#   && rm -rf /var/lib/apt/lists/*

# only copy manifest files first for better caching
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
# --- Runtime stage
# FROM base AS runner

# drop root
# RUN useradd -ms /bin/bash nodeuser
# USER nodeuser

# bring in node_modules from deps
# COPY --chown=nodeuser:nodeuser --from=deps /app/node_modules ./node_modules
COPY . .
# copy app source
# COPY --chown=nodeuser:nodeuser . .

# configure port (change if your app uses a different one)
EXPOSE 3001

# Optional healthcheck: expects your app to serve GET /health
# HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
#   CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3001)+'/health',r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

# start the server
# CMD ["dumb-init", "node", "app.js"]
CMD [ "node", "app.js"]