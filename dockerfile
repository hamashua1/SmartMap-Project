FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000
#this is the port that the server will run on

CMD ["npm", "start"]

#my dockerfile is a simple file that will build a docker image for my node.js application.




