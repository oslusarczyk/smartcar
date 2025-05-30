FROM node:22-alpine AS install
WORKDIR /app

COPY package*.json ./
RUN npm install

FROM node:22-alpine AS build
WORKDIR /app

COPY --from=install /app/node_modules ./node_modules

COPY prisma ./prisma
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build
CMD ["npm", "run", "start"]
EXPOSE 3000