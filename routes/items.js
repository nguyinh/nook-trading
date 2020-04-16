const express = require('express');
const router = express.Router();
const { items } = require('../controllers');
const { verifyJWT, findUser } = require('../middlewares');

router
  .route('/items/:itemId/bookings')
  .post(verifyJWT, findUser, items.createBooking)
  .delete(verifyJWT, findUser, items.deleteBooking);

module.exports = router;
