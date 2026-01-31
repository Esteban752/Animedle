# Utilise l'image Node officielle
FROM node:20

# Crée le dossier app
WORKDIR /app

# Copie package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code
COPY . .

# Expose le port
EXPOSE 3000

# Commande par défaut
CMD ["node", "index.js"]