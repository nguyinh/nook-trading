const { logger } = require("../middlewares");
const { posts, bookings } = require("../services");
const Boom = require("@hapi/boom");

exports.getAll = async (req, res, next) => {
  logger.info(`[CONTROLLERS | posts] getAll`);

  const { onlyDaily } = req.query;

  try {
    let fetchedPosts;
    if (onlyDaily) fetchedPosts = await posts.findAllDaily();
    else fetchedPosts = await posts.findAll();

    const formattedPosts = fetchedPosts.map((post) => ({
      _id: post._id,
      shopPicture: post.shopPicture,
      items: post.items,
      bookings: post.bookings,
      author: post.author
    })).filter(({author}) => !!author);
    // Remove posts without author

    return res.send({ posts: formattedPosts });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  const { shopPicture, items } = req.body;
  const { _id: authorId } = req.user;

  if (!items) return next(Boom.badRequest("Missing parameter in request body"));

  logger.info(`[CONTROLLERS | posts] create`);

  try {
    const createdPost = await posts.add(authorId, shopPicture, items);

    return res.send(createdPost);
  } catch (err) {
    return next(err);
  }
};

exports.createBooking = async (req, res, next) => {
  const { postId } = req.params;
  const { _id: authorId } = req.user;

  if (!postId) return next(Boom.badRequest("Missing postId in request query"));

  logger.info(
    `[CONTROLLERS | bookings] create | ${authorId} ${postId}`
  );

  try {
    const update = await bookings.add(postId, authorId, "post");

    return res.send({ post: update });
  } catch (err) {
    return next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  const { postId } = req.params;
  const { _id: authorId } = req.user;

  if (!postId) return next(Boom.badRequest("Missing postId in request query"));

  logger.info(
    `[CONTROLLERS | bookings] delete | ${authorId} ${postId}`
  );

  try {
    const update = await bookings.remove(postId, authorId, "post");

    return res.send({ post: update });
  } catch (err) {
    return next(err);
  }
};
