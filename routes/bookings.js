const express = require('express');
const router = express.Router();
const { bookings } = require('../controllers');
const { verifyJWT, findUser } = require('../middlewares');

router
  .route('/bookings')
  .post(verifyJWT, findUser, bookings.create)
  .delete(verifyJWT, findUser, bookings.delete);

module.exports = router;
