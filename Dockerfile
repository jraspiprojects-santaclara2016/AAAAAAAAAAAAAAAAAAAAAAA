FROM node:9

RUN git clone https://github.com/weebs-online/Monika.git

WORKDIR ./Monika

VOLUME ./configuration
VOLUME ./logs

RUN npm install

ENTRYPOINT ["npm", "start"]