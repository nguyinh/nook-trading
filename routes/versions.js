const express = require('express');
const router = express.Router();
const { versions } = require('../controllers');

router
  .route('/versions')
  .post(versions.add)
  .get(versions.getLatest);

module.exports = router;
