FROM --platform=linux/amd64 node:20-bullseye-slim AS base
RUN npm install -g npm@10.5.1

EXPOSE 3010
ENTRYPOINT ["/tini", "--"]

RUN apt-get update -y && apt-get install -y curl

# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

USER node
WORKDIR /home/node/app

FROM base AS development
ENV NODE_ENV=development
COPY --chown=node:node package*.json ./
RUN npm install
COPY . .
USER root
CMD ["npm", "run", "dev"]

FROM development AS build
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci
COPY webapp ./webapp
COPY --from=build /home/node/app/build/ .
CMD ["tail", "-f", "/dev/null"]
