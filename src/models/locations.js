
const database = require("./database.js");

class LocationModel{
  async getByTravelPlanId(travel_plan_id){
    let result;
    try{
      const query = `SELECT schema1.travel_plans_to_locations.location_id AS id, schema1.locations.location_id AS location_id FROM schema1.travel_plans_to_locations JOIN schema1.locations ON schema1.travel_plans_to_locations.location_id = schema1.locations.id WHERE schema1.travel_plans_to_locations.travel_plan_id = $1 ORDER BY order_number`
      const values = [travel_plan_id];
      result = await database.query(query, values);
    } 
    catch(error){
      console.error(error);
      throw new Error('Failed due to server has no database connection.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered travel_plan_id does not exist in travel_plans_to_locations table.');
    }
    return result.rows;
  }
  async get(id){
    let result;
    try{
      const query = `SELECT id, location_id FROM schema1.locations WHERE id = $1`;
      const values = [id];
      result = await database.query(query, values);
    } 
    catch(error){
      throw new Error('Failed due to server has no database connection.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered id does not exist in locations table.');
    }
    return result.rows[0];
  }

  async add(location_id){
    try{
      const query = `INSERT INTO schema1.locations(location_id) VALUES($1) RETURNING id`;
      const values = [location_id];
      const result = await database.query(query, values);
      return result.rows[0].id
    } 
    catch(error){
      console.error(error);
      throw new Error('Failed due to server has no database connection or invalid inputs.');
    }
  }
  async addToTravelPlan(travel_plan_id, id, order_number){
    try{
      const query = `INSERT INTO schema1.travel_plans_to_locations(travel_plan_id, location_id, order_number) VALUES($1, $2, $3) RETURNING id`;
      const values = [travel_plan_id, id, order_number];
      const result = await database.query(query, values);
      return result.rows[0].id;
    } 
    catch(error){
      throw new Error('Failed due to server has no database connection or invalid inputs.');
    }
  }

  async set(id, location_id){
    let result;
    try{
      const query = `UPDATE schema1.locations SET location_id = $1 WHERE id = $2 RETURNING id`;
      const values = [location_id, id];
      result = await database.query(query, values);
    }
    catch(error){
      throw new Error('Failed due to server has no database connection or invalid inputs.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered id does not exist in locations table.');
    }
    return 'Successfully set location.';
  }
  async setLocationOrder(travel_plan_id, id, order_number){
    let result;
    try{
      const query = `UPDATE schema1.travel_plans_to_locations SET order_number = $1 WHERE travel_plan_id = $2 AND location_id = $3 RETURNING id`;
      const values = [order_number, travel_plan_id, id];
      result = await database.query(query, values);
    }
    catch(error){
      throw new Error('Failed due to server has no database connection or invalid inputs.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered travel_plan_id and location_id does not exist in travel_plans_to_locations table.');
    }
    return 'Successfully set location.';
  }

  async delete(id){
    let locationIdResult;
    try{
      const locationIdQuery = `SELECT id FROM schema1.locations WHERE id = $1`;
      const loactionIdValues = [id];
      locationIdResult = await database.query(locationIdQuery, loactionIdValues);
    }
    catch(error){
      throw new Error('Failed due to server has no database connection or invalid inputs.');
    }

    if(locationIdResult.rows.length === 0){
      throw new Error('Failed due to entered id does not exist in locations table.');
    }

    try{
      const travelPlansToLocationDeleteQuery = `DELETE FROM schema1.travel_plans_to_locations WHERE location_id = ${locationIdResult.rows[0].id}`;
      await database.query(travelPlansToLocationDeleteQuery);

      const locationDeleteQuery = `DELETE FROM schema1.locations WHERE id = ${locationIdResult.rows[0].id}`;
      await database.query(locationDeleteQuery);

      return 'Successfully deleted location.';
    } 
    catch(error){}
  }
}

module.exports = LocationModel;
