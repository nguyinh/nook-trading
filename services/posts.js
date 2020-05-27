const mongoose = require("mongoose");
const { Post, Item } = require("../models");

exports.findAll = () => {
  return Post.find().populate("author items");
};

exports.findAllDaily = () => {
  const todayMidnight = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  return Post.find({
    createdAt: {
      $gte: todayMidnight,
    },
  })
    .populate({
      path: "author",
      select: "pseudo islandName",
    })
    .populate({
      path: "bookings.author",
      select: "pseudo islandName",
    })
    .populate({
      path: "items",
      populate: [
        {
          path: "bookings.author",
          select: "pseudo islandName",
        },
      ],
    });
};

exports.findById = (_id, includeAuthor) => {
  return Post.find({
    _id,
  }).populate(`${includeAuthor && "author"} item`);
};

exports.findByItemId = (itemId) =>
  Post.findOne({
    items: itemId,
  })
    .populate({ path: "author", select: "discord.id" })
    .populate({ path: "item" });

exports.add = async (author, shopPicture, items) => {
  const itemPromises = items.map((item) =>
    Item.create({
      _id: new mongoose.Types.ObjectId(),
      ...item,
    })
  );
  const createdItems = await Promise.all(itemPromises);

  return Post.create({
    _id: new mongoose.Types.ObjectId(),
    author,
    shopPicture,
    items: createdItems.map((item) => item._id),
  });
};

exports.remove = async (_id, author) => {
  return Post.findByIdAndDelete({ _id, author });
};
