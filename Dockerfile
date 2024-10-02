# Build aşaması
FROM node:16 AS builder

WORKDIR /app

# Package ve bağımlılıkları yükleme
COPY package.json package-lock.json ./
RUN npm install

# Kaynak kodlarını kopyalayıp build yapma
COPY . .
RUN npm run build

# Production aşaması
FROM node:16-alpine AS production

WORKDIR /app

# Sadece gerekli dosyaları kopyalama
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Ortam değişkenleri
ENV NODE_ENV=production
ENV PORT=3000

# Uygulama başlatma
CMD ["node", "dist/main"]

EXPOSE 3000
