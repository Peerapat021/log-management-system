# frontend/Dockerfile
FROM node:18

WORKDIR /app

# copy package.json และ package-lock.json
COPY package*.json ./

RUN npm install

# copy source code
COPY . .

# build Next.js
RUN npm run build

# expose port
EXPOSE 3000

# run Next.js
CMD ["npm", "run", "start"]
