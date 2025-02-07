FROM node:lts
LABEL authors="OpenHealth"

ARG DATABASE_URL=${DATABASE_URL}

RUN apt-get update && apt-get install -y graphicsmagick

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx prisma db seed && npm start"]
