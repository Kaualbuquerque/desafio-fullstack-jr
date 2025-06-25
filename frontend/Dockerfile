# Etapa de build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa final para produção
FROM node:18-alpine AS runner

WORKDIR /app

# Copia arquivos necessários da build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Inicia o servidor Next em produção
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
