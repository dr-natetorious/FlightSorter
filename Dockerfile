# Stage 1: Base build
FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Build
FROM base AS build
RUN npm run build

# Stage 3: Unit tests
FROM build AS test
CMD ["npm", "test"]

# Stage 4: Debugger setup for developers
FROM build AS debug
RUN npm install -g nodemon
ENV PORT=3000
RUN SWAGGER=true
EXPOSE 3000
EXPOSE 9229
CMD ["npm", "run", "dev"]

# Stage 5: Production
FROM build AS prod
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
