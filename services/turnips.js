const mongoose = require("mongoose");
const { TurnipTrend } = require("../models");

exports.add = (author) => {
  return TurnipTrend.create({
    _id: new mongoose.Types.ObjectId(),
    author,
  });
};

exports.findByAuthor = (author) => {
  return TurnipTrend.findOne({ author }).populate({
    path: "author",
    select: "pseudo avatar",
  });
};

exports.findCurrentPrice = (dayName, dayTime, lastSunday) => {
  return TurnipTrend.find({ createdAt: { $gte: lastSunday } })
    .populate({
      path: "author",
      select: "pseudo avatar",
    })
    .select(`author prices.${dayName}.${dayTime}`);
};

exports.addCurrentPrice = (dayName, dayTime, lastSunday, author, price) => {
  return TurnipTrend.findOneAndUpdate(
    { author, createdAt: { $gte: lastSunday } },
    {
      $set: {
        [`prices.${dayName}.${dayTime}`]: price,
      },
    },
    {
      new: true,
    }
  )
    .populate({
      path: "author",
      select: "pseudo avatar",
    })
    .select(`author prices.${dayName}.${dayTime}`);
};

// { $addToSet: { bookings: [{ author: authorId }] } },
//         {
//           new: true,
//         }

//         {'$set': {
//           'items.$.name': 'updated item2',
//           'items.$.value': 'two updated'
//       }}
