
const jwt = require('jsonwebtoken');

const { DATABASE_TOKEN_KEY } = require('../../../.env/secrets.js');

const authenticateToken = (request, response, next) => {
  const token = request.headers.authorization;
  if(!token){
    return response.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, DATABASE_TOKEN_KEY, (error, decoded) => {
    if(error){
      return response.status(403).json({ message: 'Invalid token' });
    }

    request.user = decoded;
    next();
  });
}

module.exports = { authenticateToken };
