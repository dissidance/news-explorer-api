const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: (props) => `${props.value} не является ссылкой`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: (props) => `${props.value} не является ссылкой`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

articleSchema.virtual('public').get(function getPublic() {
  return {
    id: this._id,
    keyword: this.keyword,
    title: this.title,
    text: this.text,
    date: this.date,
    source: this.source,
    link: this.link,
    image: this.image,
  };
});

module.exports = mongoose.model('article', articleSchema);
