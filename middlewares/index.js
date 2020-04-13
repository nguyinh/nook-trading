module.exports = {
  logger: require('./logger'),
  redirectSecure: require('./forceHttps'),
  verifyJWT: require('./verifyJWT'),
  findUser: require('./findUser'),
  errorHandler: require('./errorHandler')
}
