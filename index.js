  const express = require("express");
  require('dotenv').config();
  const cors = require('cors');
  const morgan = require("morgan");
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  const path = require('path');

  const db = require('./src/configs/db/index.js');
  const router = require("./src/routes/index.js");
  const cloudinary = require('cloudinary').v2;
  const upload = require('./src/middleware/upload.js');

  const { swaggerUi, swaggerDocs } = require('./src/configs/swagger.js');
  const app = express();
  const port = process.env.PORT || 5000;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'src/public')));
  app.use(morgan("combined"));
  
  app.use(cors({
      origin: ['http://localhost:5173', 'http://172.26.16.1:8081','exp://192.168.1.3:8081'],
      credentials: true
  }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  cloudinary.config({
      cloud_name: 'drjoyphxe',
      api_key: '837168631483714',
      api_secret: process.env.SECRET_KEY,
  });

  db.connect();

  // Định tuyến với middleware upload
  router(app, upload); // Truyền `upload` vào router nếu cần dùng ở các routes

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
