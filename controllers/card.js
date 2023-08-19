/* eslint-disable consistent-return */
const Card = require('../models/card');

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_BAD_REQUEST).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: `Карточка с указанным _id: ${req.params.cardId} не найдена.` });
        return;
      }

      if (card.owner.toString() !== req.user._id) {
        res.status(400).send({ message: 'Можно удалять только свои карточки' });
        return;
      }

      return Card.deleteOne(card).then(() => res.status(200).send(card));
    })
    .catch(() => res.status(ERROR_BAD_REQUEST).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректные данные при создании карточки' });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: `Карточка с указанным _id: ${req.params.cardId} не найдена.` });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(ERROR_BAD_REQUEST).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: `Карточка с указанным _id: ${req.params.cardId} не найдена.` });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(ERROR_BAD_REQUEST).send({ message: 'На сервере произошла ошибка' }));
};
