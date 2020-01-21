const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { key } = require('../config');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AutorizationError = require('../errors/autorization-error');
const BadRequestError = require('../errors/bad-request-error');

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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : key, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .json({ message: 'Авторизация прошла успешно' });
    })
    .catch(() => {
      next(new AutorizationError('Неправильные почта или пароль'));
    });
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, password, email,
  } = req.body;
  const isExist = await User.findOne({ email });
  if (isExist) {
    next(new AutorizationError('Такой пользователь уже существует'));
    return;
  }
  const newUser = new User({
    name, email, password,
  });
  newUser.save((err) => {
    if (err) return next(new BadRequestError('Пароль не прошел валидацию'));
    return res.send({
      name, email,
    });
  });
};
