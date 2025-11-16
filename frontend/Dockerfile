# Usar la imagen oficial de Node.js
FROM node:18-alpine as devel

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de Angular
EXPOSE 4200

# Comando para iniciar Angular en modo desarrollo con hot reload
CMD ["npm", "start"]

