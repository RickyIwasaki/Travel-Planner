
const express = require('express');

const { authenticateToken } = require("./middleware/authentication.js");
const { validateTravelPlanSchema } = require("./middleware/schema_validation.js");
const TravelPlansModel = require('../models/travel_plans.js');
const travelPlanModel = new TravelPlansModel();

const router = express.Router();

router.use(authenticateToken, validateTravelPlanSchema);

router.get('/get', async (request, response) => {
  try{
    const { user_id, limit } = request.query;
    if(user_id){
      const data = await travelPlanModel.getByUserId(user_id, limit);
      return response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api travel plans get:', error);
    response.status(503);
    return response.json({ error: `${error}` });
  }
});
router.post('/add', async (request, response) => {
  try{
    const { user_id, name } = request.body;
    if(user_id && name){
      const data = await travelPlanModel.add(user_id, name);
      return response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api travel plans add:', error);
    response.status(503);
    return response.json({ error: `${error}` });
  }
});
router.patch('/set', async (request, response) => {
  try{
    const { id, name } = request.body;
    if(id && name){
      const data = await travelPlanModel.set(id, name);
      return response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api travel plans set:', error);
    if(error.message === 'Failed due to entered id does not exist in travel_plans table.'){
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
      const data = await travelPlanModel.delete(id);
      response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api travel plans delete:', error);
    if(error.message === 'Failed due to entered id does not exist in travel_plans table.'){
      response.status(400);
    }
    else{
      response.status(503);
    }
    response.json({ error: `${error}` });
  }
});

module.exports = router;
