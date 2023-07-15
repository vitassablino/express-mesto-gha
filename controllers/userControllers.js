const User = require('../models/userScheme');

/* Обработка GET запроса /users */
const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    if (users.length === 0) {
      res.status(404).send({message: "Пользователи не обнаружены"});
      return;
    }
    res.status(200).send(users);
  })
  .catch((err) => {
    res.status(500).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
  })
};

/* Обработка GET запроса /users/:userID */
const getUserById = (req, res) => {
  User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      res.status(404).send({message: "Пользователь с данным ID не обнаружен"});
      return;
    }
    res.status(200).send(user);
  })
  .catch((err) => {
    if ( err.name === 'CastError') {
      res.status(404).send({message: "Пользователь с данным ID не обнаружен"});
      return;
    }
    res.status(500).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
  })
}

/* Обработка POST запроса /users */
const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(400).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
    })
}

/* Обработка PATCH запроса /users/me */
const updateUser = (req, res) => {
  const id = req.user._id;
  const newName = req.body.name;
  const newAbout = req.body.about;

  User.findByIdAndUpdate(
    {_id : id},
    {name: newName},
    {about: newAbout},
  )
  .then((user) => {
    res.status(200).send(user);
  })
  .catch((err) => {
    res.status(500).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
  })
}

/* Обработка PATCH запроса /users/me/avatar */
const updateAvatar = (req, res) => {
  const newAvatar = req.body.avatar;
  const id = req.user._id;

  User.findByIdAndUpdate(
    {_id : id},
    {avatar: newAvatar},
  )
  .then((user) => {
    res.status(200).send(user);
  })
  .catch((err) => {
    res.status(500).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar
};