const Boom = require("@hapi/boom");
require("dotenv").config();
const { turnips } = require("../services");
const logger = require('./logger');

module.exports = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { thisSunday } = req.body;

    const latestTrend = await turnips.findLatestTrend(_id, thisSunday);

    if (!latestTrend) {
      logger.info(`[MIDDLEWARES] createTrend | ${_id}`);

      const trend = await turnips.add(_id);
      req.trend = trend;
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
