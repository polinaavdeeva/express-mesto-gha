const User = require('../models/user');

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь с указанным _id: ${req.params.userId} не найден.` });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректные данные.' });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректные данные при создании профиля' });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь с указанным _id: ${req.params.userId} не найден.` });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректные данные.' });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь с указанным _id: ${req.params.userId} не найден.` });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректные данные.' });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};
