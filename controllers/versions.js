const { logger } = require("../middlewares");
const { versions } = require("../services");
const Boom = require("@hapi/boom");

exports.add = async (req, res, next) => {
  const { number, types, changelogs, preMessage, postMessage } = req.body;

  if (!number || !types || !changelogs)
    return next(Boom.badRequest("Missing parameters in request body"));

  logger.info(
    `[CONTROLLERS | versions] add | ${number} ${types} ${changelogs}`
  );

  try {
    await versions.disableLastVersion();
    const version = await versions.create(number, types, changelogs, preMessage, postMessage);

    return res.send({ version });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) return next(Boom.conflict(`Version ${number} is already created, please upgrade`));
    return next(err);
  }
};

exports.getLatest = async (req, res, next) => {
  logger.info(
    '[CONTROLLERS | versions] getLatest'
  );

  try {
    const version = await versions.findLatest();

    return res.send({ version });
  } catch (err) {
    return next(err);
  }
};