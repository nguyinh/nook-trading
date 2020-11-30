# Stage 1 - front build
FROM node:14.8.0-alpine
WORKDIR /usr/src/app
COPY . ./
RUN cd front/ && npm install && npm run build && cd ..

# Stage 2 - back installation and start
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install
EXPOSE 2020
CMD [ "npm", "start" ]