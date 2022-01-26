const jwt = require("jsonwebtoken");

//verification du token
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const userId = decodedToken.userId;
    req.auth = { userId };

    if (req.body.userId && req.body.userId !== userId) {
      throw "user ID invalide";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("requête invalide"),
    });
  }
};
