FROM node:lts-alpine AS devDependencies
WORKDIR /app
COPY package.json yarn.* tsconfig.json ./
COPY ./src ./src
RUN yarn install --production=false --frozen-lockfile

FROM node:lts-alpine AS dependencies
WORKDIR /app
COPY package.json yarn.* ./
COPY ./src ./src
RUN yarn install --production=true --frozen-lockfile

FROM node:lts-alpine AS build
WORKDIR /app
COPY --from=devDependencies /app/ .
COPY . .
RUN yarn build

FROM node:lts-alpine AS runtime
USER node
COPY --chown=node:node --from=dependencies /app/node_modules /home/node/app/node_modules/
COPY --from=build --chown=node:node /app/dist /home/node/app/dist/
COPY --from=build --chown=node:node /app/scripts /home/node/app/scripts/
COPY --from=build --chown=node:node /app/prisma /home/node/app/prisma/

ENTRYPOINT ["/home/node/app/scripts/server.sh"]
