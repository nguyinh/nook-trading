const express = require('express');
const router = express.Router();
const { users } = require('../controllers');
const { verifyJWT, findUser } = require('../middlewares');

router
  .route('/users')
  .get(verifyJWT, users.getAll);

router
  .route('/users/:userId')
  .get(verifyJWT, users.getById);

router
  .route('/users/avatar')
  .post(verifyJWT, findUser, users.uploadAvatar);

module.exports = router;
