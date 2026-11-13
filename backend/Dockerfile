FROM node:lts-alpine

ARG PORT
ARG MODE
ARG PG_HOST
ARG PG_PORT
ARG PG_USER
ARG PG_PASSWORD
ARG PG_DATABASE

ENV PORT=$PORT
ENV MODE=$MODE
ENV PG_HOST=$PG_HOST
ENV PG_PORT=$PG_PORT
ENV PG_USER=$PG_USER
ENV PG_PASSWORD=$PG_PASSWORD
ENV PG_DATABASE=$PG_DATABASE

# make the 'backend' folder the current working directory
WORKDIR /backend

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY src ./src

# CMD ["npm", "run", "server"]
CMD ["npm", "run", "docker_server"]
