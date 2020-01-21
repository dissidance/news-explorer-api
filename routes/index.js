const router = require('express').Router();
const usersRouter = require('./users');
const articlesRouter = require('./articles');
const NotFoundError = require('../errors/autorization-error');

router.use('/users', usersRouter);
router.use('/articles', articlesRouter);
router.use('/', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
