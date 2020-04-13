const jwt = require("jsonwebtoken");
const logger = require("./logger");
const Boom = require("@hapi/boom");
require("dotenv").config();
const { users } = require('../services');

module.exports = async (req, res, next) => {  
  try {
    const { _id } = req.decoded;
    const user = await users.findById(_id);

    if (!user) return next(Boom.notFound('User not found'));

    const { email, pseudo, islandName } = user;

    req.user = { _id, email, pseudo, islandName };

    return next();
  } catch (err) {
    return next(err);
  }
};
