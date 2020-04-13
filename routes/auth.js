const express = require('express');
const router = express.Router();
const { auth } = require('../controllers');
const {verifyJWT} = require('../middlewares');

router
  .route('/auth/connect')
  .post(verifyJWT, auth.connect);
  
router
  .route('/auth/login')
  .post(auth.login);
  
router
  .route('/auth/signin')
  .post(auth.signin);

router
  .route('/auth/logout')
  .post(auth.logout);

module.exports = router;
