const { serverErrorText } = require('../variables/messages');

module.exports = (err, req, res, next) => {
  if (!err.statusCode) {
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? serverErrorText
          : message,
      });
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
};
