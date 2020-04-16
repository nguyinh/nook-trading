const { logger } = require("../middlewares");
const { bookings, posts } = require("../services");
const Boom = require("@hapi/boom");

// exports.getAll = async (req, res, next) => {
//   logger.info(`[CONTROLLERS | posts] getAll`);

//   const { onlyDaily } = req.query;

//   try {
//     let fetchedPosts;
//     if (onlyDaily) fetchedPosts = await posts.findAllDaily();
//     else fetchedPosts = await posts.findAll();

//     const formattedPosts = fetchedPosts.map((post) => ({
//       _id: post._id,
//       shopPicture: post.shopPicture,
//       items: post.items,
//       author: {
//         _id: post.author._id,
//         pseudo: post.author.pseudo,
//       },
//     }));

//     return res.send({ posts: formattedPosts });
//   } catch (err) {
//     return next(err);
//   }
// };

exports.create = async (req, res, next) => {
  const { itemId, name, price } = req.query;
  const { _id: authorId } = req.user;
  console.log(itemId, name, price);
  if (!itemId)
    return next(Boom.badRequest("Missing itemId in request query"));

  logger.info(
    `[CONTROLLERS | bookings] create | ${authorId} ${itemId} ${name}`
  );

  try {
    const updatedItem = await bookings.add(itemId, authorId);

    return res.send({item: updatedItem});
  } catch (err) {
    return next(err);
  }
};

exports.delete = async (req, res, next) => {
  console.log(req.query);
  const { itemId } = req.query;
  const { _id: authorId } = req.user;
  console.log(itemId, authorId);
  if (!itemId)
    return next(Boom.badRequest("Missing itemId in request query"));

  logger.info(
    `[CONTROLLERS | bookings] delete | ${authorId} ${itemId}`
  );

  try {
    const updatedItem = await bookings.remove(itemId, authorId);

    return res.send({item: updatedItem});
  } catch (err) {
    return next(err);
  }
};
