FROM node:18.17.1-alpine
WORKDIR /server
COPY package.json .
RUN npm install
COPY . ./
CMD [ "npm", "run", "dev" ]
EXPOSE 9030