const { Joi } = require('celebrate');

module.exports.articleIdValidation = {
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().required().alphanum(),
  }),
};

module.exports.createCardValidation = {
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required(),
    image: Joi.string().required(),
  }),
};

module.exports.createUserValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).alphanum(),
  }),
};

module.exports.loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).alphanum(),
  }),
};
