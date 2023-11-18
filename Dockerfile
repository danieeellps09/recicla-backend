FROM node:18-alpine
WORKDIR /appd
COPY package*.json ./
RUN npm install prisma --global
RUN npm install
COPY . .
