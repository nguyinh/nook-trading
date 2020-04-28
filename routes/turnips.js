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
  .get(verifyJWT, turnips.getPrices);

module.exports = router;
