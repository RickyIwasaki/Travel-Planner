
const express = require('express');

const { authenticateToken } = require("./middleware/authentication.js");
const { validateLocationSchema } = require("./middleware/schema_validation.js");
const LocationsModel = require('../models/locations.js');
const locationsModel = new LocationsModel();

const router = express.Router();

router.use(authenticateToken, validateLocationSchema);
// need extra layer of proction (only allowing server and developers to access set and delte)

router.get('/get', async (request, response) => {
  try{
    const { id, travel_plan_id } = request.query;
    if(id){
      const data = await locationsModel.get(id);
      return response.status(200).json({ data });
    }
    else if(travel_plan_id){
      const data = await locationsModel.getByTravelPlanId(travel_plan_id);
      return response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api locations get:', error);
    response.status(503);
    return response.json({ error: `${error}` });
  }
});
router.post('/add', async (request, response) => {
  try{
    const { location_id, travel_plan_id, id, order_number } = request.body;
    if(location_id){
      const data = await locationsModel.add(location_id);
      return response.status(200).json({ data });
    }
    else if(travel_plan_id && id && order_number){
      const data = await locationsModel.addToTravelPlan(travel_plan_id, id, order_number);
      return response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api locations add:', error);
    response.status(503);
    return response.json({ error: `${error}` });
  }
});
router.patch('/set', async (request, response) => {
  try{
    const { id, location_id, travel_plan_id, order_number } = request.body;
    if(id && location_id){
      const data = await locationsModel.set(id, location_id);
      return response.status(200).json({ data });
    }
    else if(travel_plan_id && id && order_number){
      const data = await locationsModel.setLocationOrder(travel_plan_id, id, order_number);
      return response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api locations set:', error);
    if(error.message === 'Failed due to entered id does not exist in locations table.' || error.message === 'Failed due to entered travel_plan_id does not exist in travel_plans table.'){
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
      const data = await locationsModel.delete(id);
      response.status(200).json({ data });
    }
    else{
      return response.status(400).json({ message: 'invalid parameters'});
    }
  }
  catch(error){
    console.error('Error, api locations delete:', error);
    if(error.message === 'Failed due to entered id does not exist in locations table.'){
      response.status(400);
    }
    else{
      response.status(503);
    }
    response.json({ error: `${error}` });
  }
});

module.exports = router;
