const { logger } = require("../middlewares");
const { posts } = require("../services");
const Boom = require("@hapi/boom");

// exports.getById = async (req, res, next) => {
//   const { userId } = req.params;

//   if (!userId) return next(Boom.badRequest("userId is required"));

//   logger.info(`[CONTROLLERS | users] getById | ${userId}`);

//   try {
//     const fetchedUser = await users.findById(userId);

//     if (!fetchedUser)
//       return next(Boom.notFound("No user found with this userId"));

//     const { pseudo, islandName } = fetchedUser;
//     return res.send({ user: { pseudo, islandName } });
//   } catch (err) {
//     return next(err);
//   }
// };

exports.create = async (req, res, next) => {
  const { shopPicture, articles } = req.body;
  const { _id: authorId } = req.user;

  if (!articles)
    return next(Boom.badRequest("Missing parameter in request body"));

  logger.info(`[CONTROLLERS | posts] create`);

  try {
    const createdPost = await posts.add(authorId, shopPicture, articles);

    return res.send(createdPost);
  } catch (err) {
    return next(err);
  }
};
