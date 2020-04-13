const mongoose = require("mongoose");
const { Post } = require('../models');

exports.add = (author, shopPicture, articles) => {
  return Post.create({
    _id: new mongoose.Types.ObjectId(),
    author,
    shopPicture,
    articles,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
};