FROM node:10
WORKDIR /usr/src/app
COPY . ./
RUN ls
RUN npm install
RUN npm install pm2 -g
RUN npm run build
EXPOSE 7000
CMD ["pm2-runtime","./build/app.js"]