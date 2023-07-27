const cardsRouter = require('express').Router();
const {getCards, createCard, deleteCard, likeCard, unlikeCard} = require('../controllers/cardsControllers');
const { celebrate, Joi } = require('celebrate');


/* Получение всех карточек */
cardsRouter.get('/cards', getCards);

/* Удаление карточки по ID */
cardsRouter.delete('/cards/:cardId',
celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}),
deleteCard);

/* Создание карточки */
cardsRouter.post('/cards',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .regex(/^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/),
  }),
}),
createCard);

/* Лайк карточки */
cardsRouter.put('/cards/:cardId/likes',
celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}),
likeCard);

/* Снятие лайка карточки */
cardsRouter.delete('/cards/:cardId/likes',
celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}),
unlikeCard)

module.exports = cardsRouter;