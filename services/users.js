const mongoose = require("mongoose");
const { User } = require('../models');

exports.findAll = () => {
  return User.find({});
};

exports.find = id => {
  return User.findOne({id});
};

exports.add = (email, hash, pseudo, islandName) => {
  return User.create({
    _id: new mongoose.Types.ObjectId(),
    email,
    password: hash,
    pseudo,
    islandName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastConnectionAt: Date.now()
  });
};