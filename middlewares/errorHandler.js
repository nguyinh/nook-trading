const Boom = require("@hapi/boom");
const logger = require('./logger');

module.exports = (err, req, res, next) => {
  logger.error('[Express] | %s', err.message);

  let _, payload, headers;

  // Boom handled error
  if (err.isBoom) _ = { statusCode, payload, headers } = err.output;
  // Internal server error
  else _ = { statusCode, payload, headers } = Boom.badImplementation().output;

  return res
    .set(headers)
    .status(statusCode)
    .json({ error: payload });
};
