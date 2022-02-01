const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//inscription
const signup = async (req, res) => {
  //destructuration req.body.email, req.body.password
  const { email, password } = req.body;

  try {
    //on passe l'email et le password a notre usermodel
    const user = await UserModel.create({ email, password });
    return res.status(201).json({ user: user._id });
  } catch (err) {
    return res.status(401).json({ err });
  }
};

//connexion
const login = async function (req, res, next) {
  //recherche de l'email dans la base de donnée correspondant a celui de la requête
  const user = await UserModel.findOne({ email: req.body.email });
  //si la recherche est validé
  if (user) {
    //on compare les 2 password (celui de la requête avec celui dans la database)
    const auth = await bcrypt.compare(req.body.password, user.password);
    // si la comparaison renvoie true alors on crée un token
    if (auth) {
      res.status(200).json({
        userId: user._id,
        token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET_TOKEN, {
          expiresIn: "24h",
        }),
      });
    } else {
      res.status(401).json({ error: "Mot de passe ou email incorrect! " });
    }
  } else {
    res.status(401).json({ error: "Mot de passe ou email incorrect! " });
  }
};

module.exports = {
  login,
  signup,
};
