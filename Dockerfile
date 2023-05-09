FROM node:latest

ARG DATABASE_USER_NAME
ENV DATABASE_USER_NAME ${DATABASE_USER_NAME}

ARG DATABASE_HOST_NAME
ENV DATABASE_HOST_NAME ${DATABASE_HOST_NAME}

ARG DATABASE_NAME
ENV DATABASE_NAME ${DATABASE_NAME}

ARG DATABASE_PASSWORD
ENV DATABASE_PASSWORD ${DATABASE_PASSWORD}

ARG DATABASE_PORT
ENV DATABASE_PORT ${DATABASE_PORT}

ARG DATABASE_LINK
ENV DATABASE_LINK ${DATABASE_LINK}

ARG API_SECRET
ENV API_SECRET ${API_SECRET}

ARG STRIPE_SECRET_KEY
ENV STRIPE_SECRET_KEY ${STRIPE_SECRET_KEY}

ARG TOKEN_EXPIRATION
ENV TOKEN_EXPIRATION ${TOKEN_EXPIRATION}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
