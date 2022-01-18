const route = require("express").Router();

const userCtrl = require("../controllers/user");

//auth
route.post("/signup", userCtrl.signup);
route.post("/login", userCtrl.login);

module.exports = route;
