const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const userScheme = mongoose.Schema({
  _id: ObjectId,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  pseudo: {
    type: String,
    unique: true,
  },
  // friendCode: {
  //   type: String,
  //   unique: true,
  //   partialFilterExpression: { name: { $exists: true } },
  // },
  // TODO: handle null duplicates
  islandName: {
    type: String,
  },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  lastConnectionAt: {
    type: Date,
  },
});

const User = mongoose.model("User", userScheme);

User.init().then(() => {
  console.log("Users collection created");
});

module.exports = User;
