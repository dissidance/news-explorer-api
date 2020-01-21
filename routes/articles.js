const articlesRouter = require('express').Router();
const { userArticles, createArticle, removeArticle } = require('../controllers/article');

articlesRouter.get('/', userArticles);
articlesRouter.post('/', createArticle);
articlesRouter.delete('/:articleId', removeArticle);

module.exports = articlesRouter;
