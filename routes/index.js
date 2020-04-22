module.exports = server => {
  server.use('/api', require('./users'));
  server.use('/api', require('./auth'));
  server.use('/api', require('./posts'));
  server.use('/api', require('./items'));
  server.use('/api', require('./versions'));
};
