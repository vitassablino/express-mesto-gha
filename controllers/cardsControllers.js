const http2 = require('http2');
const Card = require('../models/cardScheme');
const User = require('../models/userScheme');

/*  Обработка GET запроса /cards  */
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      /* if (cards.length === 0) {
        res.send({message: "Карточки не обнаружены"});
      } */
      res.status(http2.constants.HTTP_STATUS_OK).send(cards);
    })
    .catch((err) => {
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
    })
}

/*  Обработка POST запроса /cards  */
const createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  Card.create({name, link, owner})
    .then((card) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
      }
    else {
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
    }
    })
}

/*  Обработка DELETE запроса /cards/:Id  */
const deleteCard = (req, res) => {
  const CardId = req.params.cardId;
  Card.findByIdAndRemove(CardId)
    .then((card) => {
      if (!card) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: `Произошла ошибка:  карточка с указанным ID не обнаружена`});
        return;
      }
      res.status(http2.constants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
      }
    })
}


/*  Обработка PUT запроса /cards/:cardId/likes  */
const likeCard = (req, res) => {
  const CardId = req.params.cardId;
  User.findById(req.user._id)
    .then((user) => {
    Card.findByIdAndUpdate(
      {_id: CardId},
      {$addToSet: {likes: user}},
      {new: true}
    )
    .then((card) => {
      if (!card) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: `Произошла ошибка: карточка с указанным ID не обнаружена`})
        return;
      }
      res.status(http2.constants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
      }
    })
    })
}

/*  Обработка DELETE запроса /cards/:cardId/likes  */
const unlikeCard = (req, res) => {
  const CardId = req.params.cardId;
  User.findById(req.user._id)
    .then((user) => {
      Card.findByIdAndUpdate(
        {_id: CardId},
        {$pull: {likes: user.id}},
        {new: true}
      )
      .then((card) => {
        if (!card) {
          res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: `Произошла ошибка: карточка с указанным ID не обнаружена`})
          return;
        }
        res.status(http2.constants.HTTP_STATUS_OK).send(card);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        } else {
          res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        }
      })
    })
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard
}