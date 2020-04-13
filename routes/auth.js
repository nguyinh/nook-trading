const express = require('express');
const router = express.Router();
const { users } = require('../controllers');

router
  .route('/auth/login')
  .post(auth.login);
  
router
  .route('/auth/signin')
  .post(auth.signin);

module.exports = router;
