const mongoose = require("mongoose");
const uniqueValid = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
});

//salage du password avant la sauvegarde
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.plugin(uniqueValid);

module.exports = mongoose.model("user", UserSchema);
