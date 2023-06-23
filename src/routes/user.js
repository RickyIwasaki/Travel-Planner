
const express = require('express');

// const { authenticateToken } = require("../middleware/authentication.js");
// const { validateVendorSchema } = require("../middleware/schema_validation.js");
// const VendorsModel = require('../../models/vendors.js');
// const vendorsModel = new VendorsModel();

const router = express.Router();
// router.use(authenticateToken, validateVendorSchema);

router.get('/', async (request, response) => {
  try{
    // const { timestamp, beyondTimestamp } = request.query;
    // if(timestamp){
    //   const data = await vendorsModel.getVendorsByTimestamp(timestamp, beyondTimestamp);
    //   return response.status(200).json({ data });
    // }
    // else{
    //   const data = await vendorsModel.getVendors();
    //   return response.status(200).json({ data });
    // }
  }
  catch(error){
    // console.error('Error, api vendors get:', error);
    // response.status(503);
    // return response.json({ error: `${error}` });
  }
});














