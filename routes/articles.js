const articlesRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { userArticles, createArticle, removeArticle } = require('../controllers/article');
const { articleIdValidation, createCardValidation } = require('../variables/validation');

articlesRouter.get('/', userArticles);
articlesRouter.post('/', celebrate(createCardValidation), createArticle);
articlesRouter.delete('/:articleId', celebrate(articleIdValidation), removeArticle);

module.exports = articlesRouter;
