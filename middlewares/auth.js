const jwt = require('jsonwebtoken');
const { key } = require('../config');
const AutorizationError = require('../errors/autorization-error');
const { needAuthorizationText } = require('../variables/messages');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new AutorizationError(needAuthorizationText);
  }
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, key);
    req.user = payload;
    next();
  } catch (err) {
    next(new AutorizationError(needAuthorizationText));
  }
};
