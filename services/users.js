const mongoose = require("mongoose");
const User = require("../models/user");

exports.findAll = () => {
  return User.find({});
};

exports.findById = _id => {
  return User.findOne({_id});
};

exports.findByPseudo = pseudo => {
  return User.findOne({pseudo});
};

exports.add = (hash, pseudo, islandName) => {
  return User.create({
    _id: new mongoose.Types.ObjectId(),
    password: hash,
    pseudo,
    islandName
  });
};