const mongoose = require("mongoose");
const { User } = require('../models');

exports.findAll = () => {
  return User.find({});
};

exports.findById = _id => {
  return User.findOne({_id});
};

exports.findByEmail = email => {
  return User.findOne({email});
};

exports.add = (email, hash, pseudo, islandName) => {
  return User.create({
    _id: new mongoose.Types.ObjectId(),
    email,
    password: hash,
    pseudo,
    islandName
  });
};