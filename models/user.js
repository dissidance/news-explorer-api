const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AutorizationError = require('../errors/autorization-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} не является электронной почтой`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

userSchema.virtual('public').get(function getPublic() {
  return {
    name: this.name,
    email: this.email,
  };
});

userSchema.statics.findUserByCredentials = function isExist(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AutorizationError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AutorizationError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

userSchema.pre('save', async function hashPass(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

module.exports = mongoose.model('user', userSchema);
