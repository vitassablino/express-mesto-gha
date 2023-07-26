const http2 = require('http2');
const User = require('../models/userScheme');
const bcrypt = require('bcryptjs');

/* Обработка GET запроса /users */
const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    /* if (users.length === 0) {
      res.send({message: "Пользователи не обнаружены"});
    } */
    res.status(http2.constants.HTTP_STATUS_OK).send(users);
  })
  .catch((err) => {
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
  })
};

/* Обработка GET запроса /users/:userID */
const getUserById = (req, res, next) => {
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
    next(err);
  })
}

/* Обработка POST запроса /users */
const createUser = (req, res, next) => {
  const {name, about, avatar, email, password} = req.body;
  const passwordHash = bcrypt.hash(password, 10);
  passwordHash
  .then((hash) => User.create({ name, about, avatar, password: hash, email}))
    .then((user) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(name, about, avatar, email);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        return;
      }
      next(err);
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
    next(err);
  })
}

/* Обработка PATCH запроса /users/me/avatar */
const updateAvatar = (req, res, next) => {
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
    next(err);
  })
}

/* Проверка введённых пояты и пароля */
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      next(err);
    })
};

/* получение информации о текущем порльзователе */
const getCurrentUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      next(err);
    })
};


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser
};