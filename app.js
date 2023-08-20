const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { handleError } = require('./middlewares/errorsHandler');
const NotFoundError = require('./errors/NotFoundError');
const { createUser, login } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const {
  validateUserAuthentication,
  validateUserInfo,
} = require('./middlewares/userValidation');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// подключаем к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Бд подключена');
  })
  .catch(() => {
    console.log('Что-то пошло не так');
  });

app.post('/signup', validateUserInfo, createUser);
app.post('/signin', validateUserAuthentication, login);

app.use(auth);

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use(errors());
app.use(handleError);

app.use('*', () => { throw new NotFoundError('Ресурс не найден.'); });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
