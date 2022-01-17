const mongoose = require("mongoose");

//connection a la base de donnée
mongoose
  .connect(process.env.DB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  //on recupere une promesse si elle est resolu :
  .then(() => console.log("Connexion à MongoDB réussie !"))
  //si elle n'est pas resolu
  .catch(() => console.log("Connexion à MongoDB échouée !"));
