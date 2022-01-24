const route = require("express").Router();

const userCtrl = require("../controllers/user");

//route inscription et connexion
route.post("/signup", userCtrl.signup);
route.post("/login", userCtrl.login);

module.exports = route;
