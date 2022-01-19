const route = require("express").Router();
const ctrl = require("../controllers/sauce");
const auth = require("../middlware/auth");
const multer = require("../middlware/multer");

route.get("/", auth, ctrl.allSauces);
route.get("/:id", auth, ctrl.oneSauce);
route.post("/", auth, multer, ctrl.createSauce);
route.put("/:id", auth, multer, ctrl.updateSauce);
route.delete("/:id", auth, ctrl.deleteSauce);
route.post("/:id/like", auth, ctrl.likeDislikeSauce);

module.exports = route;
