const express = require('express');
const router = express.Router();
const { posts } = require('../controllers');
const { verifyJWT, findUser } = require('../middlewares');

router
  .route('/posts')
  .get(verifyJWT, posts.getAll)
  .post(verifyJWT, findUser, posts.create);

router
  .route('/posts/:postId/bookings')
  .post(verifyJWT, findUser, posts.createBooking)
  .delete(verifyJWT, findUser, posts.deleteBooking);

module.exports = router;
