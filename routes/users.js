const express = require('express');
const router = express.Router();
const { users } = require('../controllers');

router
  .route('/users')
  .get(users.getAll)
  .post(users.create);

router
  .route('/users/:userId')
  .get(users.getById);

module.exports = router;
