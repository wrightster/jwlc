# Astro 5 SSR (@astrojs/node standalone) container image — for Coolify.
# Mirrors jwrg/Dockerfile (see jwrg/deploy/COOLIFY-PILOT.md for the full rationale).
#
# Gotchas baked in:
#  - The repo's `npm start` binds HOST=127.0.0.1, fatal in a container (the proxy
#    can't reach a loopback bind). We set HOST=0.0.0.0 and run entry.mjs directly.
#  - @astrojs/node standalone does NOT bundle node_modules, so the runtime image
#    keeps them (copied from the build stage).
#  - @jw/shared is a public `github:` dep, so `npm ci` needs git in the build stage.
#  - curl is installed in the runtime stage for Coolify's in-container health check
#    (node:22-slim ships neither curl nor wget → container marked unhealthy without it).

# ---- build ----------------------------------------------------------------
FROM node:22-slim AS build
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime --------------------------------------------------------------
FROM node:22-slim AS runtime
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
USER node
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
