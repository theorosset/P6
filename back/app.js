const express = require("express");
const app = express();
const path = require("path");
const userRoute = require("./route/user");
const sauceRoute = require("./route/sauce");
require("./models/dbConfig");

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
//routes
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoute);
app.use("/api/auth", userRoute);

module.exports = app;
