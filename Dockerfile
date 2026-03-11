FROM node:22-alpine AS base
WORKDIR /app
COPY package.json ./
RUN npm install

FROM base AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/docs ./docs
COPY --from=build /app/.env.example ./.env.example
CMD ["npm", "run", "start:docker"]

