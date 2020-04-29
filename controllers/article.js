const Article = require('../models/article');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-error');
const AccessError = require('../errors/access-error');
const {
  userNotFoundText,
  articlesNotFoundText,
  badRequestText,
  articleNotFoundText,
  articleIsDeletedText,
  accessErrorText,
} = require('../variables/messages');

module.exports.userArticles = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFoundText);
      } else {
        Article.find({ owner: _id })
          .then((articles) => res.send(articles))
          .catch(() => new NotFoundError(articlesNotFoundText));
      }
    })
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed')) {
        next(new NotFoundError(userNotFoundText));
      }
    });
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((article) => res.send(article.public))
    .catch(() => next(new BadRequestError(badRequestText)));
};

module.exports.removeArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .select('+owner')
    .then((article) => {
      if (article) {
        if (article.owner.toString() === req.user._id) {
          Article.findByIdAndRemove(req.params.articleId)
            .then(() => res.send({ message: articleIsDeletedText }))
            .catch(() => next(new NotFoundError(articleNotFoundText)));
        } else {
          throw new AccessError(accessErrorText);
        }
      } else {
        throw new NotFoundError(articleNotFoundText);
      }
    })
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed')) {
        next(new NotFoundError(articleNotFoundText));
      } else {
        next(new NotFoundError(articleNotFoundText));
      }
    });
};
