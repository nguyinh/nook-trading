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

    return res.send({ trend: fetchedTrend });
  } catch (err) {
    return next(err);
  }
};

exports.getPrices = async (req, res, next) => {
  const { day, hour, lastSunday } = req.query;

  logger.info(`[CONTROLLERS | turnips] getPrices ${day} ${hour} ${lastSunday}}`);

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

exports.createPrice = async (req, res, next) => {
  const { _id: authorId } = req.user;
  const { day, hour, lastSunday, price } = req.body;

  logger.info(`[CONTROLLERS | turnips] createPrice ${day} ${hour} ${lastSunday} ${authorId} ${price}}`);

  try {
    const dayName = days[day];
    const dayTime = hour >= 12 ? 'PM' : 'AM';

    let { _id, author, prices} = await turnips.addCurrentPrice(dayName, dayTime, lastSunday, authorId, price);

    const addedPrice = {
      _id,
      author,
      price: prices[dayName][dayTime]
    };

    return res.send({ price: addedPrice });
  } catch (err) {
    return next(err);
  }
};

