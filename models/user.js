const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const discordScheme = mongoose.Schema({
  accessToken: {
    type: String,
    select: false
  },
  refreshToken: {
    type: String,
    select: false
  },
  id: {
    type: String,
  },
  username: {
    type: String,
  },
  discriminator: {
    type: Number,
  },
});

const userScheme = mongoose.Schema({
  _id: ObjectId,
  password: {
    type: String,
  },
  pseudo: {
    type: String,
    unique: true,
  },
  friendCode: {
    type: String,
    // unique: true,
    // partialFilterExpression: { name: { $exists: true } },
  },
  // TODO: handle null duplicates
  islandName: {
    type: String,
  },
  nativeFruit: {
    type: String,
    enum: ['APPLE', 'ORANGE', 'CHERRY', 'PEACH', 'PEAR', null],
  },
  hemisphere: {
    type: String,
    enum: ['NORTH', 'SOUTH', null]
  },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  currentVersion: {
    data: String
  },
  profileDescription: {
    data: String
  },
  discord: {
    type: Object,
    Schema: discordScheme,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastConnectionAt: {
    type: Date,
    default: Date.now
  },
});

const User = mongoose.model("User", userScheme);

User.init().then(() => {
  console.log("Users collection created");
});

module.exports = User;
