const jwt = require("jsonwebtoken");
const logger = require("./logger");
const Boom = require("@hapi/boom");
require("dotenv").config();

module.exports = (req, res, next) => {
  if (!req.cookies.token) return next(Boom.unauthorized("No token"));
  
  try {
    req.decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    logger.error(err);
    res.clearCookie("token");
    return next(Boom.unauthorized("Token expired"));
  }
};
