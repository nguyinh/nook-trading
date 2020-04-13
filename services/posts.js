const mongoose = require("mongoose");
const { Post } = require('../models');

// exports.findAll = () => {
//   return User.find({});
// };

// exports.findById = _id => {
//   return User.findOne({_id});
// };

// exports.findByEmail = email => {
//   return User.findOne({email});
// };

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