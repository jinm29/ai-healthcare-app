FROM node:lts-alpine
LABEL authors="OpenHealth"

# Generate the encryption key and set it as a build argument
ARG ENCRYPTION_KEY
RUN export ENCRYPTION_KEY=$(head -c 32 /dev/urandom | base64) && \
    echo "Encryption Key: $ENCRYPTION_KEY" && \

# Set the environment variable for the subsequent layers
ENV ENCRYPTION_KEY=${ENCRYPTION_KEY}

RUN apk add -U graphicsmagick

WORKDIR /app

COPY package.json prisma/ .

RUN npm install

COPY . .

RUN npm run build && \
    adduser --disabled-password ohuser && \
    chown -R ohuser .

USER ohuser
EXPOSE 3000
ENTRYPOINT ["sh", "-c", "npx prisma db push --accept-data-loss && npx prisma db seed && npm start"]
