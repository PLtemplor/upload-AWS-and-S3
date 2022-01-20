FROM node:12-alpine

WORKDIR /node-upload
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node","/node-upload/server.js"]