const { logger } = require("../middlewares");
const { users } = require("../services");
const Boom = require("@hapi/boom");
// const bcrypt = require("bcrypt");

exports.getAll = async (req, res, next) => {
  logger.info("[CONTROLLERS | users] getAll");

  try {
    const fetchedUsers = await users.findAll();

    return res.send({
      users: fetchedUsers.map((user) => ({
        pseudo: user.pseudo,
        islandName: user.islandName,
      })),
    });
  } catch (err) {
    return next(err);
  }
};

exports.getById = async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) return next(Boom.badRequest("userId is required"));

  logger.info(`[CONTROLLERS | users] getById | ${userId}`);

  try {
    const fetchedUser = await users.findById(userId);

    if (!fetchedUser)
      return next(Boom.notFound("No user found with this userId"));

    const { pseudo, islandName } = fetchedUser;
    return res.send({ user: { pseudo, islandName } });
  } catch (err) {
    return next(err);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  const { _id } = req.decoded;
  const { avatarData } = req.body;

  logger.info(`[CONTROLLERS | users] uploadAvatar ${_id}`);

  if (!avatarData)
    return next(Boom.badRequest("Missing avatar data in request body"));

  try {
    const updatedUser = await users.updateAvatar(_id, avatarData);

    return res.send({ user: updatedUser });
  } catch (err) {
    return next(err);
  }
};