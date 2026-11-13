FROM node:lts-alpine

ARG FRONTEND_PORT=5173
ARG FRONTEND_BACKEND_HOST=http://studyflow_backend:4000
ENV FRONTEND_PORT=$FRONTEND_PORT
ENV FRONTEND_BACKEND_HOST=$FRONTEND_BACKEND_HOST

# make the 'frontend' folder the current working directory
WORKDIR /frontend

# copy both 'package.json' (if available)
COPY package.json package-lock.json ./

RUN npm install

COPY index.html ./
COPY public ./public
COPY src ./src
COPY vite.* ./
COPY .env ./
COPY tsconfig.* ./
COPY .prettierrc.json ./


CMD ["npm", "run", "dev", "--", "--host"]
