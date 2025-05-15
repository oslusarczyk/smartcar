FROM node:22-alpine AS install
WORKDIR /app

COPY package*.json ./
RUN npm install

FROM node:22-alpine AS build
WORKDIR /app

COPY --from=install /app/node_modules ./node_modules


COPY package*.json ./
COPY tsconfig.json ./
COPY webpack-hmr.config.js ./ 
COPY src ./src

RUN npx prisma generate

RUN npm run build
CMD ["npm", "run", "start:dev"]
EXPOSE 3000