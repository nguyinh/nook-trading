const express = require('express');
const router = express.Router();
const { turnips } = require('../controllers');
const { verifyJWT, findUser } = require('../middlewares');

router
  .route('/turnipTrends')
  .get(verifyJWT, turnips.get)
  .post(verifyJWT, findUser, turnips.create);

router
  .route('/turnipTrends/prices')
  .get(verifyJWT, turnips.getPrices)
  .post(verifyJWT, findUser, turnips.createPrice);


router
  .route('/turnipTrends/ownedQuantity')
  .post(verifyJWT, findUser, turnips.updateOwnedQuantity);

router
  .route('/turnipTrends/ownedValue')
  .post(verifyJWT, findUser, turnips.updateOwnedValue);

router
  .route('/turnipTrends/prices/sunday')
  .post(verifyJWT, findUser, turnips.createSundayPrice);

module.exports = router;