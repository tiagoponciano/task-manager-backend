FROM node:20-alpine AS builder

WORKDIR /app

# Remove NODE_ENV=production aqui para instalar devDependencies também
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

RUN ./node_modules/.bin/prisma generate
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

ENV PORT=3001
EXPOSE 3001

CMD sh -c "./node_modules/.bin/prisma migrate deploy && node dist/main"