const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const { NODE_ENV, DB_ADDRESS } = process.env;
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { devDbAddress } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimit');
const routes = require('./routes');
const handleError = require('./middlewares/error');

const { PORT = 3000 } = process.env;
const app = express();


const corsOptions = {
  origin: ['http://localhost:8080',
    'https://news-explorer.xyz',
    'http://news-explorer.xyz',
    'https://dissidance.github.io'],
  credentials: true,
};

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : devDbAddress, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.use('/', cors(corsOptions), routes);

app.use(errorLogger);

app.use(errors());
app.use(handleError);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
