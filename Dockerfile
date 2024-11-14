# Sử dụng image chính thức của Node.js làm nền tảng
FROM node:20

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000 (hoặc cổng mà ứng dụng của bạn sử dụng)
EXPOSE 3000

# Chạy ứng dụng khi container khởi động
CMD ["node", "index.js"]
