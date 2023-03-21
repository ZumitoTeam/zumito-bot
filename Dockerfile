FROM node:alpine
WORKDIR /usr/app
COPY package.json .
RUN apk add --no-cache --virtual .gyp python3 make g++ \
    && npm install \
    && apk del .gyp
COPY . .
EXPOSE 80
CMD ["npm", "run", "start"]