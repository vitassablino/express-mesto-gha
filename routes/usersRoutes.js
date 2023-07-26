const usersRouter = require('express').Router();
const {getUsers, getUserById, createUser, updateUser, updateAvatar, getCurrentUser} = require('../controllers/userControllers')
const { celebrate, Joi } = require('celebrate');

/* Получение всех пользователей */
usersRouter.get('/users', getUsers);

/* Получение пользователя по ID */
usersRouter.get('/users/:id', getUserById);

/* Создание пользователя */
//usersRouter.post('/users', createUser);

/* Обновление данных пользователя */
usersRouter.patch('/users/me',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}),
updateUser);

/* Обновление аватара пользователя */
usersRouter.patch('/users/me/avatar',
celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .regex(/^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/),
  }),
}),
updateAvatar);

/* получение информации о текущем пользователе */
usersRouter.get('/users/me',
/* celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), */
getCurrentUser);

module.exports = usersRouter;