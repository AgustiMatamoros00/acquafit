# Build stage
FROM node:latest AS devel

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g nodemon

# Copy source code
COPY . .

# Use nodemon for development with debugging enabled
CMD [ "nodemon", "--legacy-watch", "--inspect=0.0.0.0:9229", "--watch", ".", "--ext", "js", "app.js"]