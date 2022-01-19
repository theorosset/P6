const Sauces = require("../models/sauce");
const fs = require("fs");
const sauce = require("../models/sauce");

//recuperation d'un tableau qui contient toutes les sauces
exports.allSauces = (req, res, next) => {
  Sauces.find((err, sauces) => {
    if (!err) {
      res.status(200).json(sauces);
    } else {
      res.status(400).json({ err });
    }
  });
};

//recuperation d'une seul sauce avec son _id
exports.oneSauce = (req, res, next) => {
  Sauces.findById({ _id: req.params.id })
    .then((sauce) => {
      return res.status(200).json(sauce);
    })
    .catch((error) => res.status(400).json({ error }));
};

//suppression de la sauce
exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.findByIdAndRemove({ _id: req.params.id }, (err) => {
          if (!err) {
            res.status(200).json({ message: "Sauce supprimer" });
          } else {
            console.log(err + "delete");
          }
        });
      });
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};

//modification de la sauce
exports.updateSauce = (req, res, next) => {
  //si l'utilisateur change l'image
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : //si l'utilisateur ne change pas l'image
      { ...req.body };
  Sauces.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié" }))
    .catch((err) => res.status(400).json({ err }));
};

//creation
exports.createSauce = async (req, res, next) => {
  const SauceObj = JSON.parse(req.body.sauce);
  console.log(req.body);
  const Sauce = Sauces.create({
    ...SauceObj,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  })
    .then(() => {
      res.status(201).json({ message: "Sauce créer" });
    })
    .catch((err) => {
      return res.status(400).json("blopblop");
    });
};

exports.likeDislikeSauce = (req, res, next) => {
  const userId = req.params.userId;
  //si le like est = a 1 on incrémente les like et on ajoute l'id du user dans userLiked
  if (req.body.like === 1) {
    Sauces.updateOne(
      { _id: req.params.id },
      { $inc: { likes: +1 }, $push: { usersLiked: userId } }
    )
      .then(() => {
        return res.status(200).json({ message: "Sauce aimer" });
      })
      .catch((err) => res.status(400).json({ err: "7" }));
  }
};
