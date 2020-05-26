const express = require('express');
const router = express.Router();
const { items, sheet } = require('../controllers');
const { verifyJWT, findUser } = require('../middlewares');

router
  .route('/items/:itemId/bookings')
  .post(verifyJWT, findUser, items.createBooking)
  .delete(verifyJWT, findUser, items.deleteBooking);

  router
  .route('/items/test')
  .get(verifyJWT, findUser, sheet.TEST)

module.exports = router;