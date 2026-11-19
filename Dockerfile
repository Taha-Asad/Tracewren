FROM node:22-alpine AS builder

WORKDIR /app

# Install OpenSSL required by Prisma on Alpine
RUN apk add --no-cache openssl

# Copy workspace manifests first for layer caching
COPY package.json package-lock.json project.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm ci

# Copy application source
COPY apps/ ./apps/
COPY packages/ ./packages/

# Generate Prisma Client and build both API and Web apps
RUN npx --prefix apps/api prisma generate \
  && npm --prefix apps/api run build \
  && npm --prefix apps/web run build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/project.json ./project.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/next.config.ts ./apps/web/next.config.ts
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next

EXPOSE 3000 3001

CMD ["sh", "-c", "node apps/api/dist/main.js & exec npm --prefix apps/web run start"]
