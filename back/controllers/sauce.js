const Sauces = require("../models/sauce");
const fs = require("fs");

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
    .catch((err) => res.status(400).json({ err }));
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

//modification d'une sauce
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

//creation d'une sauce
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
      return res.status(400).json({ err });
    });
};

//possibilité de like ou dislike
exports.likeDislikeSauce = (req, res, next) => {
  const userId = req.body.userId;
  //si l'utilisateur like la sauce
  if (req.body.like === 1) {
    Sauces.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: +1 },
        $push: { usersLiked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "Like" }))
      .catch((err) => res.status(400).json({ err }));
    //si l'utilisateur dislike la sauce
  } else if (req.body.like === -1) {
    Sauces.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: +1 },
        $push: { usersDisliked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "Dislike" }))
      .catch((err) => res.status(400).json({ err }));
    //sinon l'utilisateur annule son like
  } else {
    Sauces.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauces.updateOne(
            { _id: req.params.id },
            { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
          )
            .then(() => {
              res.status(200).json({ message: "Like retiré" });
            })
            .catch((err) => res.status(400).json({ err }));
          // si l'utilisateur enlêve son dislike
        } else if (sauce.usersDisliked.includes(userId)) {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: userId },
            }
          )
            .then(() => {
              res.status(200).json({ message: "Dislike retiré" });
            })
            .catch((err) => res.status(400).json({ err }));
        }
      })
      .catch((err) => res.status(400).json({ err }));
  }
};
