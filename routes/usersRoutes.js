const usersRouter = require('express').Router();
const {getUsers, getUserById, createUser, updateUser, updateAvatar, getCurrentUser} = require('../controllers/userControllers')

/* Получение всех пользователей */
usersRouter.get('/users', getUsers);

/* Получение пользователя по ID */
usersRouter.get('/users/:id', getUserById);

/* Создание пользователя */
//usersRouter.post('/users', createUser);

/* Обновление данных пользователя */
usersRouter.patch('/users/me', updateUser);

/* Обновление аватара пользователя */
usersRouter.patch('/users/me/avatar', updateAvatar);

/* получение информации о текущем пользователе */
usersRouter.get('/users/me', getCurrentUser);

module.exports = usersRouter;