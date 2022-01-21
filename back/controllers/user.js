const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//inscription
module.exports.signup = async (req, res) => {
  //destrucuration req.body.email, req.body.password
  const { email, password } = req.body;

  try {
    //on passe l'email et le password a notre usermodel
    const user = await UserModel.create({ email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(200).json({ err });
  }
};

//connection
exports.login = async function (req, res, next) {
  const user = await UserModel.findOne({ email: req.body.email });

  if (user) {
    const auth = await bcrypt.compare(req.body.password, user.password);
    console.log(req.body.password, user.password);
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
