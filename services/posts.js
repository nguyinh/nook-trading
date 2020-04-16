const mongoose = require("mongoose");
const { Post } = require("../models");

exports.findAll = () => {
  return Post.find().populate("author");
};

exports.findAllDaily = () => {
  const todayMidnight = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  return Post.find({
    createdAt: {
      $gte: todayMidnight
    },
  }).populate("author");
};

exports.add = (author, shopPicture, items) => {
  return Post.create({
    _id: new mongoose.Types.ObjectId(),
    author,
    shopPicture,
    items
  });
};
