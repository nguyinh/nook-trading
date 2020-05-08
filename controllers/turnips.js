const { logger } = require("../middlewares");
const { turnips } = require("../services");
const Boom = require("@hapi/boom");

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
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
      if (withSundayPrices)
        fetchedTrends = fetchedTrends.filter((trend) => trend.sundayPrice);
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

    const trend = await turnips.addCurrentPrice(
      dayName,
      dayTime,
      thisSunday,
      authorId,
      parseInt(price)
    );

    return res.send({ trend });
  } catch (err) {
    return next(err);
  }
};

exports.updatePrices = async (req, res, next) => {
  const { _id: authorId } = req.user;
  const { trendId, prices } = req.body;

  logger.info("[CONTROLLERS | turnips] updatePrices");

  try {
    const trend = await turnips.setPrices(authorId, trendId, prices);

    return res.send({ trend });
  } catch (err) {
    return next(err);
  }
};

exports.updateType = async (req, res, next) => {
  const { _id: authorId } = req.user;
  const { trendId, currentDate, trendType } = req.body;

  logger.info(`[CONTROLLERS | turnips] updateType | ${authorId} ${trendId || currentDate} ${trendType}`);

  try {
    let trend = null;

    if (trendId) 
      trend = await turnips.setTypeById(authorId, trendId, trendType);
    else {
      if (!currentDate) return next(Boom.badRequest('Missing currentDate in body'));

      const now = new Date(currentDate);
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const lastSunday = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const incomingSunday = new Date(
        today.setDate(today.getDate() + 7 - today.getDay())
      );
      trend = await turnips.setTypeByDate(authorId, lastSunday, incomingSunday, trendType);
    }

    return res.send({ trend });
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
      price ? parseInt(price) : null
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
    if (isNaN(quantity))
      return next(Boom.badRequest("Quantity is not a number"));

    let trend = await turnips.setTurnipQuantity(
      thisSunday,
      authorId,
      quantity ? parseInt(quantity) : null
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
      price ? parseInt(price) : null
    );

    return res.send({ trend });
  } catch (err) {
    return next(err);
  }
};
