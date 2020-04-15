const { logger } = require("../middlewares");
const { posts } = require("../services");
const Boom = require("@hapi/boom");

exports.getAll = async (req, res, next) => {
  logger.info(`[CONTROLLERS | posts] getAll`);

  try {
    const fetchedPosts = await posts.findAll();

    return res.send({posts: fetchedPosts});
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  const { shopPicture, items } = req.body;
  const { _id: authorId } = req.user;

  if (!items)
    return next(Boom.badRequest("Missing parameter in request body"));

  logger.info(`[CONTROLLERS | posts] create`);

  try {
    const createdPost = await posts.add(authorId, shopPicture, items);

    return res.send(createdPost);
  } catch (err) {
    return next(err);
  }
};
