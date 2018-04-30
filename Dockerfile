FROM node:9

COPY . /Monika

WORKDIR ./Monika

RUN npm install

ENTRYPOINT ["npm", "start-migrate"]