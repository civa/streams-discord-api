FROM node:18
WORKDIR /root
COPY package*.json ./
RUN npm install -g pnpm 
RUN pnpm install
COPY . .
CMD ["node", "app.js"]