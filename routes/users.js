const express = require('express');
const router = express.Router();
const { users } = require('../controllers');
const { verifyJWT } = require('../middlewares');

router
  .route('/users')
  .get(verifyJWT, users.getAll);

router
  .route('/users/:userId')
  .get(verifyJWT, users.getById);

module.exports = router;
