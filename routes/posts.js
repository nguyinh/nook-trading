const express = require('express');
const router = express.Router();
const { posts } = require('../controllers');
const { verifyJWT, findUser } = require('../middlewares');

router
  .route('/posts')
  // .get(verifyJWT, users.getAll);
  .post(verifyJWT, findUser, posts.create);

module.exports = router;
