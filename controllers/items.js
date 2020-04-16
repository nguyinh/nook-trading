const { logger } = require("../middlewares");
const { bookings } = require("../services");
const Boom = require("@hapi/boom");

exports.createBooking = async (req, res, next) => {
  const { itemId } = req.params;
  const { _id: authorId } = req.user;

  if (!itemId) return next(Boom.badRequest("Missing itemId in request query"));

  logger.info(
    `[CONTROLLERS | bookings] create | ${authorId} ${itemId}`
  );

  try {
    const update = await bookings.add(itemId, authorId, "item");

    return res.send({ item: update });
  } catch (err) {
    return next(err);
  }
};


exports.deleteBooking = async (req, res, next) => {
  const { itemId } = req.params;
  const { _id: authorId } = req.user;

  if (!itemId) return next(Boom.badRequest("Missing itemId in request query"));

  logger.info(
    `[CONTROLLERS | bookings] delete | ${authorId} ${itemId}`
  );

  try {
    const update = await bookings.remove(itemId, authorId, "item");

    return res.send({ item: update });
  } catch (err) {
    return next(err);
  }
};