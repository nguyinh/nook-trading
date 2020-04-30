module.exports = {
  logger: require('./logger'),
  redirectSecure: require('./forceHttps'),
  verifyJWT: require('./verifyJWT'),
  findUser: require('./findUser'),
  createTrend: require('./createTrend'),
  errorHandler: require('./errorHandler')
}
