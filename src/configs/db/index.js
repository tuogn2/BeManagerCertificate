const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.URLMongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect successfully mongodb"); 
  } catch (error) {
    console.log(error);
  }
}


module.exports  = {connect}