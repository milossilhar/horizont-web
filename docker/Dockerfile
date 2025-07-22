FROM node:22-slim AS npm-install

WORKDIR /usr/src/frontend

# copy package and package-lock files
COPY package*.json ./

# install packages
RUN npm ci

FROM node:22-slim AS angular-build

WORKDIR /usr/src/frontend

COPY --from=npm-install /usr/src/frontend/node_modules ./node_modules

COPY . .

# build angular
RUN npm run build --omit=dev

FROM caddy:2.9

LABEL cicd="registration-web"

COPY ./docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=angular-build /usr/src/frontend/dist/registration-web/browser/ /var/www/angular
