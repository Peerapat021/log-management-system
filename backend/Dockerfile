FROM node:18

# set workdir
WORKDIR /app

# copy package files
COPY package*.json ./

# install deps
RUN npm install

# copy source
COPY . .

# build (ถ้าใช้ ts)
RUN npm run build

# run app
CMD ["npm", "run", "start"]
