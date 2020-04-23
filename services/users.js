const mongoose = require("mongoose");
const { User } = require("../models");

exports.findAll = () => {
  return User.find({});
};

exports.findById = (_id) => {
  return User.findOne({ _id }).select("-password");
};

exports.findByPseudo = (pseudo) => {
  return User.findOne({ pseudo });
};

exports.add = (
  hash,
  pseudo,
  islandName,
  hemisphere,
  nativeFruit,
  friendCode
) => {
  return User.create({
    _id: new mongoose.Types.ObjectId(),
    password: hash,
    pseudo,
    islandName,
    hemisphere,
    nativeFruit,
    friendCode,
  });
};

exports.updateVersion = (_id, currentVersion) => {
  return User.findOneAndUpdate({ _id }, { currentVersion });
};

exports.updateAvatar = (_id, avatar) => {
  return User.findOneAndUpdate(
    { _id },
    { avatar, updatedAt: Date.now() }
  ).select("-password");
};

exports.update = (
  _id,
  friendCode,
  islandName,
  nativeFruit,
  hemisphere,
  profileDescription
) => {
  return User.findOneAndUpdate(
    { _id },
    {
      friendCode,
      islandName,
      nativeFruit,
      hemisphere,
      profileDescription,
      updatedAt: Date.now(),
    }
  ).select("-password");
};
