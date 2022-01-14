const express = require("express");
const ctrl = require("../controllers/sauce");
const route = express.Router();

route.get("/", ctrl.allSauces);
route.get("/:id", ctrl.oneSauce);

module.exports = route;
