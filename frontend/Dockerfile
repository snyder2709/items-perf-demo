# Base image
FROM node:lts-alpine

WORKDIR /app

ENV VITE_BASE_API_URL=http://localhost:3000/api

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--port", "5173", "--host"]
