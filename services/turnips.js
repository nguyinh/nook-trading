const mongoose = require("mongoose");
const { TurnipTrend } = require("../models");

exports.add = (author) => {
  return TurnipTrend.create({
    _id: new mongoose.Types.ObjectId(),
    author,
  });
};

exports.findByAuthor = (author) => {
  return TurnipTrend.findOne({author}).populate({
    path: "author",
    select: 'pseudo avatar'
  });
};


exports.findCurrentPrice = (dayName, dayTime, lastSunday) => {
  return TurnipTrend.find({createdAt: { $gte: lastSunday}}).populate({
    path: "author",
    select: 'pseudo avatar'
  })
  .select(`author prices.${dayName}.${dayTime}`);
};
