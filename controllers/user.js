const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

module.exports.userInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с таким id не существует');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed')) {
        next(new NotFoundError('Пользователя с таким id не существует'));
      }
    });
};
