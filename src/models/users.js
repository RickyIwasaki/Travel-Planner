
const bcrypt = require('bcrypt');

const { REGULAR_ENCRYPTION_KEY } = require('../../.env/secrets.js');
const database = require("./database.js");
const { hash, compareHash } = require('../helpers/encryptions.js')

class UsersModel{
  async isUsernameUnique(username){
    try{
      const query = `SELECT pgp_sym_decrypt(username::bytea, '${REGULAR_ENCRYPTION_KEY}') AS username FROM schema1.users`;
      const result = await database.query(query);
      
      for(let row of result.rows){
        if(row.username === username){
          return false;
        }
      }
    }
    catch(error){
      console.error("Error: no users table or no database connection:", error);
      throw new Error("Failed due to no users table or no database connection.");
    }
    return true;
  }
  async isEmailUnique(email){
    try{
      const query = `SELECT pgp_sym_decrypt(email::bytea, '${REGULAR_ENCRYPTION_KEY}') AS email FROM schema1.users`;
      const result = await database.query(query);
      
      for(let row of result.rows){
        if(row.email === email){
          return false;
        }
      }
    }
    catch(error){
      console.error("Error: no users table or no database connection:", error);
      throw new Error("Failed due to no users table or no database connection.");
    }
    return true;
  }

  async getUserByUsername(username){
    try{
      const query = `SELECT id, pgp_sym_decrypt(username::bytea, '${REGULAR_ENCRYPTION_KEY}') AS username, checked_at FROM schema1.vendors WHERE pgp_sym_decrypt(username::bytea, '${REGULAR_ENCRYPTION_KEY}') = $1`;
      const values = [username];
      const result = await database.query(query, values);
      return result.rows[0];
    } 
    catch(error){
      throw new Error('Failed due to no users table or no database connection.');
    }
  }

  async addUser(username, email, password){
    const isUsernameUnique = await this.isUsernameUnique(username);
    if(!isUsernameUnique){
      throw new Error('Failed due to username already exists.');
    }
    const isEmailUnique = await this.isEmailUnique(email);
    if(!isEmailUnique){
      throw new Error('Failed due to email already exists.');
    }

    try{
      const hashedPassword = hash(password);
      const query = `INSERT INTO schema1.users(username, email, hashed_password) VALUES(pgp_sym_encrypt($1, '${REGULAR_ENCRYPTION_KEY}'), pgp_sym_encrypt($2, '${REGULAR_ENCRYPTION_KEY}'), $3)`;
      const values = [username, email, hashedPassword];
      await database.query(query, values);
      return 'Successfully added user.';
    } 
    catch(error){
      throw new Error('Failed due to no users table, no database connection, or invalid inputs.');
    }
  }

  async setCheckedAt(name, timestamp){
    let result;
    try{
      if(!timestamp){
        timestamp = new Date().toISOString();
      }
      const query = `UPDATE schema1.vendors SET checked_at = $1 WHERE pgp_sym_decrypt(name::bytea, '${REGULAR_ENCRYPTION_KEY}') = $2 RETURNING name`;
      const values = [timestamp, name];
      result = await database.query(query, values);
    }
    catch(error){
      throw new Error('Failed due to no vendors table, no database connection, or invalid inputs.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered name does not exist in vendors table.');
    }
    return 'Successfully set vendor.';
  }

  async deleteVendorByName(name){
    let result;
    try{
      const idQuery = `SELECT id FROM schema1.vendors WHERE pgp_sym_decrypt(name::bytea, '${REGULAR_ENCRYPTION_KEY}') = $1`;
      const values = [name];
      result = await database.query(idQuery, values);
    }
    catch(error){
      throw new Error('Failed due to no vendors table, no database connection, or invalid inputs.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered name does not exist in vendors table.');
    }

    try{
      const deleteQuery = `DELETE FROM vendors WHERE id = ${result.rows[0].id}`;
      await database.query(deleteQuery);
      return 'Successfully deleted vendor.';
    } 
    catch(error){
      throw new Error('Failed due to other database tables are in a relationship.');
    }
  }
}

module.exports = UsersModel;