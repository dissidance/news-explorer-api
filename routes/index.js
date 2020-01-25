const router = require('express').Router();
const { celebrate } = require('celebrate');
const usersRouter = require('./users');
const articlesRouter = require('./articles');
const { createUserValidation, loginValidation } = require('../variables/validation');
const { createUser, login } = require('../controllers/user');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/autorization-error');
const { resoureNotFoundText } = require('../variables/messages');

router.post('/signup', celebrate(createUserValidation), createUser);
router.post('/signin', celebrate(loginValidation), login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/articles', articlesRouter);
router.use('/', (req, res, next) => {
  next(new NotFoundError(resoureNotFoundText));
});

module.exports = router;
