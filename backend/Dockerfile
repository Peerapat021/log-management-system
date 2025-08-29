FROM node:18

# set workdir
WORKDIR /app

# copy package files
COPY package*.json ./

# install deps
RUN npm install

# copy source code
COPY . .

# build TypeScript เป็น JavaScript
RUN npm run build

# run compiled JS
CMD ["node", "dist/index.js"]
