FROM node:16-alpine as build-stage
RUN mkdir -p /usr/src/medre-admin && chown -R node:node /usr/src/medre-admin
WORKDIR /usr/src/medre-admin
COPY package.json .
USER node
RUN npm install
COPY --chown=node:node . .
RUN npm run build
EXPOSE 4646
CMD [ "npx", "serve", "build" ]

FROM nginx:1.21.0-alpine as production-stage
COPY --from=build-stage /usr/src/medre-admin/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
