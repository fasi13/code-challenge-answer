require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const express = require('express');
const cors = require("cors");

const app = express();

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

//Configure Route
require('./routes/index') (app);

// server static assets if in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("../client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));