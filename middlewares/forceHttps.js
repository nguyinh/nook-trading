module.exports = (req, res, next) => {
  // console.log('req secure : ' + req.secure);
  // console.log('X-Forwarded-Proto : ' + req.get('X-Forwarded-Proto') === 'https');
  if (req.secure || req.get('X-Forwarded-Proto') === 'https') {
    return next();
  } else {
    // console.log('redirect to ' + `https://${req.get('host')}${req.originalUrl || req.url}`);
    return res.redirect(`https://${req.get('host')}${req.originalUrl || req.url}`);
  }
};
