const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, errors } = require('celebrate');
const { createUserValidation, loginValidation } = require('./variables/validation');
const auth = require('./middlewares/auth');
const routes = require('./routes');
const handleError = require('./middlewares/error');
const { createUser, login } = require('./controllers/user');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/news-explorer-db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signup', celebrate(createUserValidation), createUser);
app.post('/signin', celebrate(loginValidation), login);

app.use(auth);
app.use('/', routes);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
