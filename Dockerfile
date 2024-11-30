FROM node:20-alpine

# Cài đặt các thư viện hệ thống cần thiết cho canvas
RUN apk update && apk add --no-cache \
    cairo-dev \
    pango-dev \
    giflib-dev \
    && rm -rf /var/cache/apk/*

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy các file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các thư viện Node.js từ package.json
RUN npm install

# Copy tất cả mã nguồn còn lại vào container
COPY . .

# Khởi động ứng dụng
CMD ["node", "index.js"]