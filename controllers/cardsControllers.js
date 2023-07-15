const Card = require('../models/cardScheme');
const User = require('../models/userScheme');

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
      res.status(500).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
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
      res.status(400).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
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
      res.status(500).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
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
        res.status(404).send({message: `Произошла ошибка: карточка с указанным ID не обнаружена`})
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      res.status(400).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
    })
    })
    .catch((err) => {
      res.status(400).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
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
        res.status(404).send({message: `Произошла ошибка: карточка с указанным ID не обнаружена`})
        return;
      }
        res.status(200).send(card);
      })
      .catch((err) => {
        res.status(400).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
      })
    })
    .catch((err) => {
      res.status(400).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
    })
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard
}