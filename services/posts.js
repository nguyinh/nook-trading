const mongoose = require("mongoose");
const { Post } = require('../models');

exports.findAll = (includeAuthor) => {
  return Post.find().populate('author');
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