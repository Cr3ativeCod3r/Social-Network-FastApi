     
# Używamy oficjalnego Node.js
FROM node:20-alpine

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę plików
COPY . .

# Budujemy aplikację (dla Vite dev można pominąć)
# RUN npm run build

# Domyślny port Vite
EXPOSE 5173

# Uruchamiamy serwer developerski Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]