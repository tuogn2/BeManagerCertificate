const express = require("express");
require('dotenv').config()
const cors = require('cors')
const morgan = require("morgan");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')

const db = require('./src/configs/db/index.js');
const router = require("./src/routes/index.js");
const app = express();
const port = process.env.port ||5000; 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'src/public')));
console.log(__dirname)
app.use(morgan("combined"));  
app.use(cors(
  {
      // origin: process.env.DEV == 1 ? 'http://localhost:3000' : [`http://${process.env.HOST}`, `https://${process.env.HOST}`],
      origin:  'http://localhost:3000' ,
      credentials: true
  }
))

db.connect()
router(app)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
