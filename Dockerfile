FROM node:20-slim

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./

COPY artifacts/api-server ./artifacts/api-server
COPY lib ./lib

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/api-server run build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
