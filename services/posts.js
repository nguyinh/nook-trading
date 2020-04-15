const mongoose = require("mongoose");
const { Post } = require('../models');

exports.findAll = (author, shopPicture, items) => {
  return Post.find();
};

exports.add = (author, shopPicture, items) => {
  return Post.create({
    _id: new mongoose.Types.ObjectId(),
    author,
    shopPicture,
    items,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
};