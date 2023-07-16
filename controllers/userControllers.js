const http2 = require('http2');
const User = require('../models/userScheme');

/* Обработка GET запроса /users */
const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    if (users.length === 0) {
      res.send({message: "Пользователи не обнаружены"});
    }
    res.status(http2.constants.HTTP_STATUS_OK).send(users);
  })
  .catch((err) => {
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
  })
};

/* Обработка GET запроса /users/:userID */
const getUserById = (req, res) => {
  User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: "Пользователь с данным ID не обнаружен"});
      return;
    }
    res.status(http2.constants.HTTP_STATUS_OK).send(user);
  })
  .catch((err) => {
    if ( err.name === 'CastError') {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({message: "Пользователь с данным ID не обнаружен"});
      return;
    }
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
  })
}

/* Обработка POST запроса /users */
const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        return;
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
    })
}

/* Обработка PATCH запроса /users/me */
const updateUser = (req, res) => {
  const id = req.user._id;
  const newName = req.body.name;
  const newAbout = req.body.about;

  User.findByIdAndUpdate(
    {_id : id},
    {name: newName, about: newAbout}, //перечень обновляемых данных
    {new: true, //возврат новой копии
    runValidators: true} //Включение валидации
  )
  .then((user) => {
    res.status(http2.constants.HTTP_STATUS_OK).send(user);
  })
  .catch((err) => {
    res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
  })
}

/* Обработка PATCH запроса /users/me/avatar */
const updateAvatar = (req, res) => {
  const newAvatar = req.body.avatar;
  const id = req.user._id;

  User.findByIdAndUpdate(
    {_id : id},
    {avatar: newAvatar},
    {new: true, //возврат новой копии
    runValidators: true} //Включение валидации
  )
  .then((user) => {
    res.status(http2.constants.HTTP_STATUS_OK).send(user);
  })
  .catch((err) => {
    res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
  })
  .catch((err) => {
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar
};