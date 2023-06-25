
const jsonschema = require('jsonschema');

const userSchema = require('../schemas/user.json');

const validateUserSchema = (request, response, next) => {
  const result = jsonschema.validate(request.body, userSchema);
  if(result.errors.length !== 0){
    const errors = result.errors.map((error) => error.stack);
    return response.status(400).json({ message: 'Invalid user schema', errors })
  }
  next();
}

module.exports = { validateUserSchema };
