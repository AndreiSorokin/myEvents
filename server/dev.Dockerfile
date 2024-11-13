FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY --chown=node:node . .

RUN npm install -g nodemon

EXPOSE 3003

CMD ["npm", "run", "dev"]