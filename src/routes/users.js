
const express = require('express');

const { authenticateToken } = require("./middleware/authentication.js");
const { validateUserSchema } = require("./middleware/schema_validation.js");
const UsersModel = require('../models/users.js');
const userModel = new UsersModel();

const router = express.Router();

router.post('/authenticate', async (request, response) => {
  try{
    const { username, password } = request.body;
    if(username && password){
      const data = await userModel.authenticate(username, password);
      response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api users authenticate:', error);
    if(error.message === 'Failed due to entered username does not exist in users table.' || error.message === 'Failed due to entered password not matching for user.'){
      response.status(400);
    }
    else{
      response.status(503);
    }
    response.json({ error: `${error}` });
  }
});

router.use(authenticateToken, validateUserSchema);

router.get('/get', async (request, response) => {
  try{
    const { username } = request.query;
    if(username){
      const data = await userModel.getByUsername(username);
      return response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api users get:', error);
    response.status(503);
    return response.json({ error: `${error}` });
  }
});
router.post('/add', async (request, response) => {
  try{
    const { username, email, password } = request.body;
    if(username && email && password){
      const data = await userModel.add(username, email, password);
      return response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api users add:', error);
    if(error.message === 'Failed due to username already exists.' || error.message === 'Failed due to email already exists.'){
      response.status(409);
    }
    else{
      response.status(503);
    }
    return response.json({ error: `${error}` });
  }
});
router.patch('/set', async (request, response) => {
  try{
    const { id, username, email, password } = request.body;
    if(id && (username || email || password)){
      const data = await userModel.set(id, username, email, password);
      return response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api users set:', error);
    if(error.message === 'Failed due to username already exists.' || error.message === 'Failed due to email already exists.'){
      response.status(409);
    }
    else if(error.message === 'Failed due to entered id does not exist in users table.'){
      response.status(400);
    }
    else{
      response.status(503);
    }
    return response.json({ error: `${error}` });
  }
});
router.delete('/delete', async (request, response) => {
  try{
    const { id } = request.body;
    if(id){
      const data = await userModel.delete(id);
      response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api users delete:', error);
    if(error.message === 'Failed due to entered id does not exist in users table.'){
      response.status(400);
    }
    else{
      response.status(503);
    }
    response.json({ error: `${error}` });
  }
});

module.exports = router;
