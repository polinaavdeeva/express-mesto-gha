const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ERROR_NOT_FOUND } = require('./errors/errors');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');

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

app.use('/users', require('./routes/user'));
app.use('/cards', auth, require('./routes/card'));

app.use('*', (req, res) => res.status(ERROR_NOT_FOUND).json({ message: `Ресурс по адресу ${req.path} не найден` }));

app.post('/signin', login);
app.post('/signup', createUser);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
