const Article = require('../models/article');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-error');
const AccessError = require('../errors/access-error');

module.exports.userArticles = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с таким id не существует');
      } else {
        Article.find({ owner: _id })
          .then((articles) => res.send(articles))
          .catch(() => new NotFoundError('Статьи не найдены'));
      }
    })
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed')) {
        next(new NotFoundError('Пользователя с таким id не существует'));
      }
    });
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send(article))
    .catch(() => next(new BadRequestError('Данные не прошли валидацию')));
};

module.exports.removeArticle = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .then((article) => {
      if (article) {
        if (article.owner.toString() === req.user._id) {
          Article.findByIdAndRemove(req.params.articleId)
            .then(() => res.send({ message: 'Статья удалена' }))
            .catch(() => next(new NotFoundError('Статьи с таким id не существует')));
        } else {
          throw new AccessError('Недостаточно прав');
        }
      }
    })
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed')) {
        next(new NotFoundError('Карточки с таким id не существует'));
      }
      next(err);
    });
};
