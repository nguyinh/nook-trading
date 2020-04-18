const { Post, Item } = require("../models");

exports.add = (_id, authorId, bookingType) => {
  return bookingType === "item"
    ? Item.findOneAndUpdate(
        { _id },
        { $addToSet: { bookings: [{ author: authorId }] } },
        {
          new: true,
        }
      ).populate({
        path: "bookings.author",
        select: "pseudo islandName",
      })
    : Post.findOneAndUpdate(
        { _id },
        { $addToSet: { bookings: [{ author: authorId }] } },
        {
          new: true,
        }
      )
        .select("-shopPicture")
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

exports.remove = (_id, authorId, bookingType) => {
  return bookingType === "item"
    ? Item.findOneAndUpdate(
        { _id },
        { $pull: { bookings: { author: authorId } } },
        {
          new: true,
        }
      ).populate({
        path: "bookings.author",
        select: "pseudo islandName",
      })
    : Post.findOneAndUpdate(
        { _id },
        { $pull: { bookings: { author: authorId } } },
        {
          new: true,
        }
      )
        .select("-shopPicture")
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
