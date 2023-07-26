const jwt = require('jsonwebtoken');
const http2 = require('http2');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовок

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({message: "Для доступа необходимо авторизироваться"});
  }

  let payload;

  const userToken = authorization.replace('Bearer ', '');   // извлеченние токена

  try {
    payload = jwt.verify(userToken, 'token-generate-key');
  } catch (err) {
    return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({message: "Для доступа необходимо авторизироваться"});
  }

  req.user = payload;
  next();
};