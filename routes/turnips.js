const express = require('express');
const router = express.Router();
const { turnips } = require('../controllers');
const { verifyJWT, findUser, createTrend } = require('../middlewares');

router
  .route('/turnipTrends')
  .get(verifyJWT, turnips.get)
  .post(verifyJWT, findUser, turnips.create);

router
  .route('/turnipTrends/prices')
  .get(verifyJWT, turnips.getPrices)
  .post(verifyJWT, findUser, createTrend, turnips.createPrice)
  .put(verifyJWT, findUser, createTrend, turnips.updatePrices);

router
  .route('/turnipTrends/ownedQuantity')
  .post(verifyJWT, findUser, createTrend, turnips.updateOwnedQuantity);

router
  .route('/turnipTrends/ownedPrice')
  .post(verifyJWT, findUser, createTrend, turnips.updateOwnedPrice);

router
  .route('/turnipTrends/prices/sunday')
  .post(verifyJWT, findUser, createTrend, turnips.createSundayPrice);

module.exports = router;