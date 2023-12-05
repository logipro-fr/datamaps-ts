FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm install -g nodemon
EXPOSE 3000

CMD ["nodemon", "src/nodeserver.js"]