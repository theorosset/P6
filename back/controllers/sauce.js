const Sauces = require("../models/sauce");
const fs = require("fs");

//recuperation d'un tableau qui contient toutes les sauces
const allSauces = (req, res, next) => {
  Sauces.find((err, sauces) => {
    if (!err) {
      res.status(200).json(sauces);
    } else {
      res.status(500).json({ err });
    }
  });
};

//recuperation d'une seul sauce avec son _id
const oneSauce = (req, res, next) => {
  Sauces.findById({ _id: req.params.id })
    .then((sauce) => {
      return res.status(200).json(sauce);
    })
    .catch((err) => res.status(400).json({ err }));
};

//suppression de la sauce
const deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      //si l'userId de la sauce est différent de celui authentifier on retourne une erreur
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ message: "ce n'est pas votre sauce !" });
      } else {
        //séléction de l'image a supprimer
        const filename = sauce.imageUrl.split("/images/")[1];
        //suppression du fichier sur notre serveur et suppression de la sauce dans la DB
        fs.unlink(`images/${filename}`, () => {
          Sauces.findByIdAndRemove({ _id: req.params.id }, (err) => {
            if (!err) {
              res.status(200).json({ message: "Sauce supprimer" });
            } else {
              console.log(err + "delete");
            }
          });
        });
      }
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};

//modification d'une sauce
const updateSauce = (req, res, next) => {
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
const createSauce = async (req, res, next) => {
  const SauceObj = JSON.parse(req.body.sauce);
  //création de la sauce dans la DB
  Sauces.create({
    ...SauceObj,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],

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
const likeDislikeSauce = (req, res, next) => {
  const userId = req.auth.userId;

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

module.exports = {
  allSauces,
  oneSauce,
  deleteSauce,
  updateSauce,
  createSauce,
  likeDislikeSauce,
};
