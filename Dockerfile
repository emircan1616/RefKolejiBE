# 1. Node.js base image'ini kullanıyoruz
FROM node:18-alpine

# 2. Çalışma dizinini oluştur ve app dosyalarını buraya kopyala
WORKDIR /app

# 3. package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# 4. Bağımlılıkları yükle
RUN npm install --only=production

# 5. Diğer dosyaları da kopyala
COPY . .

# 6. Uygulamanın çalışacağı portu tanımla (container içerisindeki port)
EXPOSE 3004

# 7. Uygulamayı başlat
CMD ["npm", "run", "start"]
