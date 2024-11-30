FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
# COPY ./ ./
COPY . .
CMD ["node", "index.js"]

# CMD ["npm", "run","start"]
