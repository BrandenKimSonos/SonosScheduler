FROM node:10
WORKDIR /usr/src/app
COPY . ./
RUN npm install pm2 -g
RUN npm run build
CMD ["pm2-runtime","./build/app.js"]