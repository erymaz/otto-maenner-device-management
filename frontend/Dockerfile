## Builder
FROM node:14-alpine AS builder

RUN apk add python make g++ --update

WORKDIR /app

COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
RUN npm i --unsafe-perm

COPY ./ /app/

ARG BUILD_ENVIRONMENT
RUN npm run "build:${BUILD_ENVIRONMENT}"


## Final image
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY _fixtures/nginx /etc/nginx/conf.d
COPY --from=builder /app/dist/device-management /usr/share/nginx/html

EXPOSE 80
