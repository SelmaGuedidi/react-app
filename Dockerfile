# Stage 1: Build the React application
FROM node:18-alpine 


RUN mkdir -p /app/src


WORKDIR /app/src


COPY package.json .


RUN npm install

COPY . .


EXPOSE 3000


CMD ["npm", "start"]
