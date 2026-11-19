FROM node:22-alpine AS builder

WORKDIR /app

# Install OpenSSL and libc6-compat required by Prisma & Next.js native binaries on Alpine
RUN apk add --no-cache openssl libc6-compat

# Copy workspace manifests first for layer caching
COPY package.json package-lock.json project.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm ci

# Copy application source
COPY apps/ ./apps/
COPY packages/ ./packages/

# Provide build-time placeholder DB URLs (never baked into runner stage)
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bbt?schema=bbt_core"
ENV DIRECT_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bbt?schema=bbt_core"

# Generate Prisma Client and build both API and Web apps from their own directories
RUN cd /app/apps/api && npx prisma generate && npm run build \
  && cd /app/apps/web && npm run build

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
