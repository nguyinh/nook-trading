module.exports = server => {
  server.use('/api', require('./users'));
  server.use('/api', require('./auth'));
  // server.use('/posts', require('./posts'));
};
