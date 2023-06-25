
const jsonschema = require('jsonschema');

const userSchema = require('../schemas/user.json');
const travelPlanSchema = require('../schemas/travel_plan.json');
const locationSchema = require('../schemas/location.json');

const validateUserSchema = (request, response, next) => {
  const result = jsonschema.validate(request.body, userSchema);
  if(result.errors.length !== 0){
    const errors = result.errors.map((error) => error.stack);
    return response.status(400).json({ message: 'Invalid user schema', errors })
  }
  next();
}
const validateTravelPlanSchema = (request, response, next) => {
  const result = jsonschema.validate(request.body, travelPlanSchema);
  if(result.errors.length !== 0){
    const errors = result.errors.map((error) => error.stack);
    return response.status(400).json({ message: 'Invalid travel_plan schema', errors })
  }
  next();
}
const validateLocationSchema = (request, response, next) => {
  const result = jsonschema.validate(request.body, locationSchema);
  if(result.errors.length !== 0){
    const errors = result.errors.map((error) => error.stack);
    return response.status(400).json({ message: 'Invalid location schema', errors })
  }
  next();
}

module.exports = { validateUserSchema, validateTravelPlanSchema, validateLocationSchema };
