const jwt = require('jsonwebtoken');
const logger = require('./logger');
require("dotenv").config();

module.exports = (req, res, next) => {
  if (req.cookies.token) {
    try {
      req.decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      return next();
    } catch (err) {
      logger.error(err);
      res.clearCookie('token');
      return res.status(401).send({error: 'TOKEN_EXPIRED'})
    }
  } else {
    return res.status(401).send({error: 'NO_TOKEN'})
  }
};
