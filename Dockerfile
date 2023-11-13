FROM node:18.17.1-alpine
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9030
CMD [ "npm", "run", "start:dev" ]