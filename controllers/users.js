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

// exports.create = async (req, res, next) => {
//   const { email, password, pseudo, islandName } = req.body;

//   if (!email || !password || !pseudo || !islandName)
//     return next(Boom.badRequest("Missing parameter in request body"));

//   logger.info(
//     `[CONTROLLERS | users] create | ${email} as ${pseudo} in island ${islandName}`
//   );

//   try {
//     const hash = await bcrypt.hash(password, 10);

//     const { _id } = await users.add(email, hash, pseudo, islandName);

//     return res.send({ user: { _id, email, pseudo, islandName } });
//   } catch (err) {
//     if (err.code === 11000)
//       return next(Boom.conflict("Email or pseudo already taken"));
//     return next(err);
//   }
// };
