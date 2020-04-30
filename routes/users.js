const usersRouter = require('express').Router();
const { userInfo } = require('../controllers/user');

usersRouter.get('/me', userInfo);

module.exports = usersRouter;
