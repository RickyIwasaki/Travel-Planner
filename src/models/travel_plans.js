
const { REGULAR_ENCRYPTION_KEY } = require('../../.env/secrets.js');
const database = require("./database.js");

class TravelPlansModel{
  async getByUserId(user_id, limit){
    let result;
    try{
      const query = `SELECT schema1.user_to_travel_plans.travel_plan_id AS id, pgp_sym_decrypt(schema1.travel_plans.name::bytea, '${REGULAR_ENCRYPTION_KEY}') AS name FROM schema1.user_to_travel_plans JOIN schema1.travel_plans ON schema1.user_to_travel_plans.travel_plan_id = schema1.travel_plans.id WHERE schema1.user_to_travel_plans.user_id = $1 LIMIT $2`;
      const values = [user_id, limit];
      result = await database.query(query, values);
    } 
    catch(error){
      console.error(error);
      throw new Error('Failed due to server has no database connection.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered user_id does not exist in user_to_travel_plans table.');
    }
    return result.rows;
  }

  async add(user_id, name){
    try{
      const travelPlanQuery = `INSERT INTO schema1.travel_plans(name) VALUES(pgp_sym_encrypt($1, '${REGULAR_ENCRYPTION_KEY}')) RETURNING id`;
      const travelPlanValues = [name];
      const travelPlanResult = await database.query(travelPlanQuery, travelPlanValues);

      const userToTravelPlanQuery = `INSERT INTO schema1.user_to_travel_plans(user_id, travel_plan_id) VALUES($1, $2)`;
      const userToTravelPlanValues = [user_id, travelPlanResult.rows[0].id];
      await database.query(userToTravelPlanQuery, userToTravelPlanValues);

      return travelPlanResult.rows[0].id
    } 
    catch(error){
      throw new Error('Failed due to server has no database connection or invalid inputs.');
    }
  }

  async set(id, name){
    let result;
    try{
      const query = `UPDATE schema1.travel_plans SET name = pgp_sym_encrypt($1, '${REGULAR_ENCRYPTION_KEY}') WHERE id = $2 RETURNING id`;
      const values = [name, id];
      result = await database.query(query, values);
    }
    catch(error){
      throw new Error('Failed due to server has no database connection or invalid inputs.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered id does not exist in travel_plans table.');
    }
    return 'Successfully set travel_plan.';
  }

  async delete(id){
    let travelPlanIdResult;
    try{
      const travelPlanIdQuery = `SELECT id FROM schema1.travel_plans WHERE id = $1`;
      const travelPlanIdValues = [id];
      travelPlanIdResult = await database.query(travelPlanIdQuery, travelPlanIdValues);
    }
    catch(error){
      throw new Error('Failed due to server has no database connection or invalid inputs.');
    }

    if(travelPlanIdResult.rows.length === 0){
      throw new Error('Failed due to entered id does not exist in travel_plans table.');
    }

    try{
      const userToTravelPlanDeleteQuery = `DELETE FROM schema1.user_to_travel_plans WHERE travel_plan_id = ${travelPlanIdResult.rows[0].id}`;
      await database.query(userToTravelPlanDeleteQuery);
      
      const travelPlanDeleteQuery = `DELETE FROM schema1.travel_plans WHERE id = ${travelPlanIdResult.rows[0].id}`;
      await database.query(travelPlanDeleteQuery);

      return 'Successfully deleted travel_plan.';
    } 
    catch(error){
      throw new Error('Failed due to other database tables are in a relationship.');
    }
  }
}

module.exports = TravelPlansModel;
