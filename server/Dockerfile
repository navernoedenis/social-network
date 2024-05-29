FROM node:22-alpine

WORKDIR /usr/share/app

COPY ["package*.json", ".npmrc", "./"]

RUN npm install

COPY . .

CMD [ "npm", "run", "start:dev" ]
