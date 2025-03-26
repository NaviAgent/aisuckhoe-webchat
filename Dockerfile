# PREPARE NODE_MODULES IN PRODUCTION MODE
FROM node:22-alpine as base
WORKDIR /app
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# # Install dependencies
# FROM base as dependencies


# Build the app
FROM base as builder
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm build

# Production image
FROM base as production

RUN apk add --no-cache tini

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["pnpm", "start"]
