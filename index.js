// Add Express
const express = require("express");
const mongoose = require("mongoose");


const connectDatabase = async () => {
  try {


    
    await mongoose.connect(process.env.MONGODBURL || "mongodb://localhost:27017",{
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDatabase();

// Initialize Express
const app = express();

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;