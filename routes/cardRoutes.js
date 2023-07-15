const cardsRouter = require('express').Router();
const {getCards, createCard, deleteCard, likeCard, unlikeCard} = require('../controllers/cardsControllers');

/* Получение всех карточек */
cardsRouter.get('/cards', getCards);

/* Удаление карточки по ID */
cardsRouter.delete('/cards/:cardId', deleteCard);

/* Создание карточки */
cardsRouter.post('/cards', createCard);

/* Лайк карточки */
cardsRouter.put('/cards/:cardId/likes', likeCard);

/* Снятие лайка карточки */
cardsRouter.delete('/cards/:cardId/likes', unlikeCard)

module.exports = cardsRouter;