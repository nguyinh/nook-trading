const { logger } = require("../middlewares");
const { turnips } = require("../services");
const Boom = require("@hapi/boom");

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'tuesday', 'friday', 'saturday'];

exports.create = async (req, res, next) => {
  const { _id } = req.user;

  logger.info(`[CONTROLLERS | turnips] create | ${_id}`);

  try {
    const createdTrend = await turnips.add(_id);

    return res.send({ trend: createdTrend });
  } catch (err) {
    return next(err);
  }
};

exports.get = async (req, res, next) => {
  const { authorId } = req.query;

  logger.info(`[CONTROLLERS | turnips] get | ${authorId}`);

  try {
    const fetchedTrend = authorId ? await turnips.findByAuthor(authorId) : turnips.find();
    console.log(fetchedTrend);
    return res.send({ trend: fetchedTrend });
  } catch (err) {
    return next(err);
  }
};

exports.getPrices = async (req, res, next) => {
  const { day, hour, lastSunday } = req.query;
  console.log(day, hour, lastSunday);

  logger.info(`[CONTROLLERS | turnips] getAll ${day} ${hour} ${lastSunday}}`);

  try {
    const dayName = days[day];
    const dayTime = hour >= 12 ? 'PM' : 'AM';

    const fetchedTrends = await turnips.findCurrentPrice(dayName, dayTime, lastSunday);

    const trends = fetchedTrends.map(({_id, author, prices}) => ({
      _id,
      author,
      price: prices[dayName][dayTime]
    })).filter(({price}) => !!price);

    return res.send({ trends });
  } catch (err) {
    return next(err);
  }
};
