const express = require("express");
const path = require("path");
const userRoute = require("./route/user");
const sauceRoute = require("./route/sauce");

const app = express();

//connection a mangodb
require("./DBconfig/dbConfig");

//recuperation des requete qui on un content-type json
app.use(express.json());

//initialisation des header
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

// route pour recuperer les image depuis un dossier
app.use("/images", express.static(path.join(__dirname, "images")));

//route globale des sauces
app.use("/api/sauces", sauceRoute);

//route globale pour la connexion
app.use("/api/auth", userRoute);

module.exports = app;
