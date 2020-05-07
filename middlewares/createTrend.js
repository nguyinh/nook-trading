const Boom = require("@hapi/boom");
require("dotenv").config();
const { turnips } = require("../services");
const logger = require("./logger");

module.exports = async (req, res, next) => {
  try {
    const { _id } = req.user;
    let { thisSunday } = req.body;

    if (!thisSunday) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      thisSunday = new Date(today.setDate(today.getDate() - today.getDay()));
    }

    const latestTrend = await turnips.findLatestTrend(_id, thisSunday);
    try {
      if (!latestTrend) {
        logger.info(`[MIDDLEWARES] createTrend | ${_id}`);

        const trend = await turnips.add(_id);
        req.trend = trend;
      }
    } catch (err) {
      logger.error(`[MIDDLEWARES] createTrend | ${_id} ${err}`);
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
