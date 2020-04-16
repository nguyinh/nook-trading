const { Post, Item } = require("../models");

exports.add = (_id, authorId, bookingType) => {
  return bookingType === "item"
    ? Item.findOneAndUpdate(
        { _id },
        { $addToSet: { bookings: [{ author: authorId }] } },
        {
          new: true,
        }
      )
    : Post.findOneAndUpdate(
        { _id },
        { $addToSet: { bookings: [{ author: authorId }] } },
        {
          new: true,
        }
      ).populate('author');
};

exports.remove = (_id, authorId, bookingType) => {
  return bookingType === "item"
    ? Item.findOneAndUpdate(
        { _id },
        { $pull: { bookings: { author: authorId } } },
        {
          new: true,
        }
      )
    : Post.findOneAndUpdate(
        { _id },
        { $pull: { bookings: { author: authorId } } },
        {
          new: true,
        }
      ).populate('author');
};
