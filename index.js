// Add Express
const express = require("express");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const router = require("./routes/routes");
let  env = require("dotenv");
env = env.config();
const bodyParser = require("body-parser");
const connectDatabase = async () => {
  try {


    
    await mongoose.connect(env.parsed.MONGODBURL,{
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", router);
// console.log(router);
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