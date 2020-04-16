const mongoose = require("mongoose");
const { Post, Item } = require("../models");

exports.findAll = () => {
  return Post.find().populate("author");
};

exports.findAllDaily = () => {
  const todayMidnight = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  return Post.find({
    createdAt: {
      $gte: todayMidnight,
    },
  }).populate("author");
};

exports.add = (itemId, authorId) => {
  return Item.findOneAndUpdate(
    { _id: itemId },
    { $addToSet: { bookings: [{ author: authorId }] } },
    {
      new: true,
    }
  );
};

exports.remove = (itemId, authorId) => {
  return Item.findOneAndUpdate(
    { _id: itemId },
    { $pull: { bookings: { author: authorId } } },
    {
      new: true,
    }
  );
};
