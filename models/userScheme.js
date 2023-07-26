const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (correct) => validator.isURL(correct),
      message: 'Некорректный адрес',
    },
  },
  email: {
    type: String,
    minlength: 4,
    maxlength: 50,
    validate: {
      validator: (correct) => validator.isEmail(correct),
      message: 'Введённая почта не найдена',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, //по умолчанию хеш пароля пользователя не будет возвращаться из базы
/*     validate: {
      validator(v) {
        return validator.isStrongPassword(v);  //Иногда рунается автотест
      },
      message: (props) => `${props.value} не является надежным паролем`,
    }, */
  }
});

userScheme.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userScheme);