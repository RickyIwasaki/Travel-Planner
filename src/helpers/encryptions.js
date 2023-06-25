
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { DATABASE_TOKEN_KEY } = require('../../.env/secrets.js');

const hash = async (password) => {
  try{
    const saltRounds = 14;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } 
  catch(error){
    throw new Error(`Failed due to server's connection.`);
  }
}

const compareHash = async (password, hashedPassword) => {
  try{
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } 
  catch(error){
    throw new Error(`Failed due to server's connection.`);
  }
}

const createToken = (payload) => {
  const token = jwt.sign(payload, DATABASE_TOKEN_KEY);
  return token;
}

module.exports = { hash, compareHash, createToken };
