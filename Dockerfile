FROM node:lts-alpine
LABEL authors="OpenHealth"

ARG DATABASE_URL=${DATABASE_URL}

RUN apk add graphicsmagick

WORKDIR /app
COPY . .
 
RUN npm install
RUN npm run build

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx prisma db seed && npm start"]
