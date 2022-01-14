const express = require("express");
const app = express();
const mongoose = require("mongoose");

//connection a la base de donnée
mongoose
  .connect(process.env.DB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  //on recupere une promesse si elle est resolu :
  .then(() => console.log("Connexion à MongoDB réussie !"))
  //si elle n'est pas resolu
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//info sur tp
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
module.exports = app;
