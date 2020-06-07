const { logger } = require("../middlewares");
const { bookings, posts, users, discord } = require("../services");
const Boom = require("@hapi/boom");

exports.createBooking = async (req, res, next) => {
  const { itemId } = req.params;
  const { _id: authorId } = req.user;

  if (!itemId) return next(Boom.badRequest("Missing itemId in request query"));

  logger.info(`[CONTROLLERS | bookings] create | ${authorId} ${itemId}`);

  try {
    const update = await bookings.add(itemId, authorId, "item");

    // Send response
    res.send({ item: update });

    // Find item author
    const {
      author: { discord: discordInfo },
      shopPicture,
    } = await posts.findByItemId(itemId);

    // Send DM if Discord linked
    if (discordInfo) {
      // Find booking author pseudo
      const { pseudo: buyerPseudo } = await users.findById(authorId);

      // Send Discord DM to seller
      await discord.sendDM(
        discordInfo.id,
        `${update.name} intéresse ${buyerPseudo}${
          update.price ? ` pour ${update.price} clochettes` : ""
        } !`,
        shopPicture.data.toObject()
      );
    }
  } catch (err) {
    return next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  const { itemId } = req.params;
  const { _id: authorId } = req.user;

  if (!itemId) return next(Boom.badRequest("Missing itemId in request query"));

  logger.info(`[CONTROLLERS | bookings] delete | ${authorId} ${itemId}`);

  try {
    const update = await bookings.remove(itemId, authorId, "item");

    return res.send({ item: update });
  } catch (err) {
    return next(err);
  }
};
