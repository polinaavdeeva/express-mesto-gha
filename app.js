const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ERROR_NOT_FOUND } = require('./errors/errors');

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

app.use((req, res, next) => {
  req.user = {
    _id: '64b0acb5b69baf98c5ee407b',
  };

  next();
});

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('*', (req, res) => res.status(ERROR_NOT_FOUND).json({ message: `Ресурс по адресу ${req.path} не найден` }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
