const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Espera el header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no enviado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, nombre, email }
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
};