require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const db_url = process.env.DB_URL;
    console.log(process.env.DB_URL)
    await mongoose.connect(db_url);
    console.log("database connected");
  } catch (e) {
    console.log(e);
  }
};

module.exports = {dbConnect}; 
