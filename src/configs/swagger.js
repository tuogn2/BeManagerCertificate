// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Cấu hình Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Phiên bản OpenAPI
    info: {
      title: 'API Documentation', // Tiêu đề
      version: '1.0.0', // Phiên bản API
      description: 'API for managing courses and certificates', // Mô tả
    },
    servers: [
      {
        url: 'http://localhost:5000', // URL server của bạn
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Đường dẫn tới file route
};

// Tạo Swagger specs từ swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};
