const Sauces = require("../models/sauce");

//recuperation d'un tableau qui contient toutes les sauces
exports.allSauces = (req, res, next) => {
  Sauces.find((err, sauces) => {
    if (!err) {
      res.status(200).json(sauces);
    } else {
      res.status(401).json({ err });
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
  Sauces.findById({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json("HELLO");
    })
    .catch((err) => {
      res.status(403).json({ err });
    });
};

exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
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

  const Sauce = Sauces.create({
    ...SauceObj,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  try {
    const sauce = await Sauce.save();

    return res.status(201).json(sauce);
  } catch (err) {
    return res.status(400).json("blopblop");
  }
};
