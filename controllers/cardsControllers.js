const Card = require('../models/cardScheme');
const User = require('../models/userScheme');

const errorHandle = require('../utils/utils')

/*  Обработка GET запроса /cards  */
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.status(404).send({message: "Карточки не обнаружены"});
        return;
      }
      res.status(200).send(cards);
    })
    .catch((err) => {
      errorHandle
    })
}

/*  Обработка POST запроса /cards  */
const createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  Card.create({name, link, owner})
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      errorHandle
    })
}

/*  Обработка DELETE запроса /cards/:Id  */
const deleteCard = (req, res) => {
  const CardId = req.params.cardId;
  Card.findByIdAndRemove(CardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({message: "Карточки с данным ID не обнаружено"});
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      errorHandle
    })
}


/*  Обработка PUT запроса /cards/:cardId/likes  */
const likeCard = (req, res) => {
  const CardId = req.params.cardId;
  User.findById(CardId)
    .then((user) => {
    Card.findByIdAndUpdate(
      {_id: cardId},
      {$addToSet: {likes: user}},
      {new: true}
    )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      errorHandle
    })
    })
    .catch((err) => {
      errorHandle
    })
}

/*  Обработка DELETE запроса /cards/:cardId/likes  */
const unlikeCard = (req, res) => {
  const CardId = req.params.cardId;
  User.findById(CardId)
    .then((user) => {
      Card.findByIdAndUpdate(
        {_id: cardId},
        {$pull: {likes: user}},
        {new: true}
      )
      .then((card) => {
        res.status(200).send(card)
      })
      .catch((err) => {
        errorHandle
      })
    })
    .catch((err) => {
      errorHandle
    })
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard
}