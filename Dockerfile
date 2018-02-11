FROM node:latest

RUN mkdir -p /home/node/docker/monikabot
WORKDIR /home/node/docker/monikabot

COPY package.json /home/node/docker/monikabot
RUN npm install

COPY . /home/node/docker/monikabot

CMD "node sharder.js"