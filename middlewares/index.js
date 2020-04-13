module.exports = {
  logger: require('./logger'),
  redirectSecure: require('./forceHttps'),
  verifyJWT: require('./jwt')
}
