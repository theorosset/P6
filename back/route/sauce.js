const route = require("express").Router();
const ctrl = require("../controllers/sauce");

route.get("/", ctrl.allSauces);
route.get("/:id", ctrl.oneSauce);
route.post("/", ctrl.createSauce);
route.post;
route.post;
route.post("/:id/like");

module.exports = route;
