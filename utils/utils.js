/* Функция обработки ошибки */
const errorHandle = (err) => {
  res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}`});
}

 module.exports = {
  errorHandle
}