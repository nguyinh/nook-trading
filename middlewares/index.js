module.exports = {
  logger: require('./logger'),
  redirectSecure: require('./forceHttps'),
  verifyJWT: require('./verifyJWT'),
  errorHandler: require('./errorHandler')
}
