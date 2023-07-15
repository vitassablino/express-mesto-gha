const express = require('express');
const mongoose = require('mongoose'); //подключение БД Монго
const app = express(); //создание точки входа
const bodyParser = require('body-parser');  //подключение парсера

const userRoutes = require('./routes/usersRoutes'); //подключение роутов пользователя
const cardsRoutes = require('./routes/cardRoutes'); //добавление роутов карточек

const { PORT = 3000} = process.env;

/* Адрес БД */
const mestodb = 'mongodb://127.0.0.1:27017/mestodb';
/* Получение подключения */
const db = mongoose.connection;
/* Подключение к серверу Mongo */
mongoose.connect(mestodb)
/* Подключение к событию ошибки */
db.on('error', console.error.bind(console, 'ошибка подключения к mestoDB'))

app.get('/', (req, res) => {
  res.send(
        `<html>
        <body>
            <p>Ответ на сигнал из далёкого космоса1111</p>
        </body>
        </html>`
    );
});

app.use(bodyParser.json()); // настройка парсера для приёма JSON

/* Мидлвара добавления user в каждый запрос */
app.use((req, res, next) => {
  req.user = {
    _id: '64b1bffe3939ba8f0f010d73'
  };
  next();
});

/* Добавление роутов */
app.use('/', userRoutes);
app.use('/', cardsRoutes);



app.listen(PORT, () => {
  console.log(`Прослушивание порта ${PORT}`)
});