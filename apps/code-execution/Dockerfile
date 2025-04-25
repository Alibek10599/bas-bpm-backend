FROM node:20-alpine As development

RUN apk add --no-cache \
  python3 \
  make \
  g++

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY webpack.config.js webpack.config.js

RUN npm install -g pnpm

COPY apps/code-execution apps/code-execution
COPY libs libs

RUN pnpm install -r

RUN pnpm run build code-execution

FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "--no-node-snapshot", "dist/apps/code-execution/main"]