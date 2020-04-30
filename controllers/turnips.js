const { logger } = require("../middlewares");
const { turnips } = require("../services");
const Boom = require("@hapi/boom");

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "tuesday",
  "friday",
  "saturday",
];

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
  const { authorId, thisSunday, withSundayPrices } = req.query;

  logger.info(`[CONTROLLERS | turnips] get | ${authorId || ""} ${thisSunday}`);

  try {
    if (authorId) {
      const fetchedTrend = await turnips.findByAuthor(authorId, thisSunday);
      return res.send({ trend: fetchedTrend });
    } else {
      let fetchedTrends = await turnips.findAll(thisSunday);
      if (withSundayPrices) fetchedTrends = fetchedTrends.filter(trend => trend.sundayPrice);
      return res.send({ trends: fetchedTrends });
    }
  } catch (err) {
    return next(err);
  }
};

exports.getPrices = async (req, res, next) => {
  const { day, hour, thisSunday } = req.query;

  logger.info(
    `[CONTROLLERS | turnips] getPrices ${day} ${hour} ${thisSunday}}`
  );

  try {
    const dayName = days[day];
    const dayTime = hour >= 12 ? "PM" : "AM";

    const fetchedTrends = await turnips.findCurrentPrice(
      dayName,
      dayTime,
      thisSunday
    );

    const isEmpty = (obj) => Object.entries(obj).length === 0;

    const trends = fetchedTrends
      .map(({ _id, author, prices }) => ({
        _id,
        author,
        price: !isEmpty(prices) ? prices[dayName][dayTime] : null,
      }))
      .filter(({ price }) => !!price);

    return res.send({ trends });
  } catch (err) {
    return next(err);
  }
};

exports.createPrice = async (req, res, next) => {
  const { _id: authorId } = req.user;
  const { day, hour, thisSunday } = req.body;
  let { price } = req.body;

  logger.info(
    `[CONTROLLERS | turnips] createPrice ${day} ${hour} ${thisSunday} ${authorId} ${price}}`
  );

  try {
    const dayName = days[day];
    const dayTime = hour >= 12 ? "PM" : "AM";

    price = parseInt(price);
    if (isNaN(price)) return next(Boom.badRequest("Price is not a number"));

    let { _id, author, prices } = await turnips.addCurrentPrice(
      dayName,
      dayTime,
      thisSunday,
      authorId,
      parseInt(price)
    );

    const addedPrice = {
      _id,
      author,
      price: prices[dayName][dayTime],
    };

    return res.send({ price: addedPrice });
  } catch (err) {
    return next(err);
  }
};

// SUNDAY WITH PORCELETTE
exports.createSundayPrice = async (req, res, next) => {
  const { _id: authorId } = req.user;
  const { thisSunday } = req.body;
  let { price } = req.body;

  logger.info(
    `[CONTROLLERS | turnips] createSundayPrice ${thisSunday} ${authorId} ${price}}`
  );

  try {
    price = parseInt(price);
    if (isNaN(price)) return next(Boom.badRequest("Price is not a number"));

    let trend = await turnips.setSundayPrice(
      thisSunday,
      authorId,
      parseInt(price)
    );

    return res.send({ trend });
  } catch (err) {
    return next(err);
  }
};

exports.updateOwnedQuantity = async (req, res, next) => {
  const { _id: authorId } = req.user;
  const { thisSunday } = req.body;
  let { quantity } = req.body;

  logger.info(
    `[CONTROLLERS | turnips] updateOwnedQuantity ${thisSunday} ${authorId} ${quantity}}`
  );

  try {
    quantity = parseInt(quantity);
    if (isNaN(quantity)) return next(Boom.badRequest("Quantity is not a number"));

    let trend = await turnips.setTurnipQuantity(
      thisSunday,
      authorId,
      parseInt(quantity)
    );

    return res.send({ trend });
  } catch (err) {
    return next(err);
  }
};

exports.updateOwnedPrice = async (req, res, next) => {
  const { _id: authorId } = req.user;
  const { thisSunday } = req.body;
  let { price } = req.body;

  logger.info(
    `[CONTROLLERS | turnips] updateOwnedPrice ${thisSunday} ${authorId} ${price}}`
  );

  try {
    price = parseInt(price);
    if (isNaN(price)) return next(Boom.badRequest("Price is not a number"));

    let trend = await turnips.setTurnipValue(
      thisSunday,
      authorId,
      parseInt(price)
    );

    return res.send({ trend });
  } catch (err) {
    return next(err);
  }
};
