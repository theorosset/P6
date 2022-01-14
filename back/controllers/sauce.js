const Sauces = require("../models/sauce");

//recuperation d'un tableau qui contient toutes les sauces
exports.allSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => {
      const sauceMap = sauces.map((sauces) => {
        return sauces;
      });
      console.log(sauceMap);
      return res.status(200).json(sauceMap);
    })
    .catch((error) => res.status(400).json({ error }));
};

//recuperation d'une seul sauce
exports.oneSauce = (req, res, next) => {
  Sauces.findById({ _id: req.params.id })
    .then((sauce) => console.log(sauce))
    .catch((error) => res.status(400).json({ error }));
};
