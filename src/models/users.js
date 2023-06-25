
const bcrypt = require('bcrypt');

const { REGULAR_ENCRYPTION_KEY } = require('../../.env/secrets.js');
const database = require("./database.js");
const { hash, compareHash, createToken } = require('../helpers/encryptions.js');

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
    let result;
    try{
      const query = `SELECT id, pgp_sym_decrypt(username::bytea, '${REGULAR_ENCRYPTION_KEY}') AS username, pgp_sym_decrypt(email::bytea, '${REGULAR_ENCRYPTION_KEY}') AS email, hashed_password, authority, monthly_requests FROM schema1.users WHERE pgp_sym_decrypt(username::bytea, '${REGULAR_ENCRYPTION_KEY}') = $1`;
      const values = [username];
      result = await database.query(query, values);
    } 
    catch(error){
      throw new Error('Failed due to no users table or no database connection.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered username does not exist in users table.');
    }
    return result.rows[0];
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
      const hashedPassword = await hash(password);
      const query = `INSERT INTO schema1.users(username, email, hashed_password) VALUES(pgp_sym_encrypt($1, '${REGULAR_ENCRYPTION_KEY}'), pgp_sym_encrypt($2, '${REGULAR_ENCRYPTION_KEY}'), $3)`;
      const values = [username, email, hashedPassword];
      await database.query(query, values);
      return 'Successfully added user.';
    } 
    catch(error){
      throw new Error('Failed due to no users table, no database connection, or invalid inputs.');
    }
  }

  async set(id, username, email, password){
    let result;
    try{
      let query;
      let values;

      let hashed_password;
      if(password){
        hashed_password = await hash(password);
      }

      if(username && email && password){
        query = `UPDATE schema1.users SET username = pgp_sym_encrypt($1, '${REGULAR_ENCRYPTION_KEY}'), email = pgp_sym_encrypt($2, '${REGULAR_ENCRYPTION_KEY}'), hashed_password = $3 WHERE id = $4 RETURNING id`;
        values = [username, email, hashed_password, id];
      }
      else if(username && email){
        query = `UPDATE schema1.users SET username = pgp_sym_encrypt($1, '${REGULAR_ENCRYPTION_KEY}'), email = pgp_sym_encrypt($2, '${REGULAR_ENCRYPTION_KEY}') WHERE id = $3 RETURNING id`;
        values = [username, email, id];
      }
      else if(username && password){
        query = `UPDATE schema1.users SET username = pgp_sym_encrypt($1, '${REGULAR_ENCRYPTION_KEY}'), hashed_password = $2 WHERE id = $3 RETURNING id`;
        values = [username, hashed_password, id];
      }
      else if(email && password){
        query = `UPDATE schema1.users SET email = pgp_sym_encrypt($1, '${REGULAR_ENCRYPTION_KEY}'), hashed_password = $2 WHERE id = $3 RETURNING id`;
        values = [email, hashed_password, id];
      }
      else if(username){
        query = `UPDATE schema1.users SET username = pgp_sym_encrypt($1, '${REGULAR_ENCRYPTION_KEY}') WHERE id = $2 RETURNING id`;
        values = [username, id];
      }
      else if(email){
        query = `UPDATE schema1.users SET email = pgp_sym_encrypt($1, '${REGULAR_ENCRYPTION_KEY}') WHERE id = $2 RETURNING id`;
        values = [email, id];
      }
      else if(password){
        query = `UPDATE schema1.users SET hashed_password = $1 WHERE id = $2 RETURNING id`;
        values = [hashed_password, id];
      }

      result = await database.query(query, values);
    }
    catch(error){
      throw new Error('Failed due to no users table, no database connection, or invalid inputs.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered id does not exist in users table.');
    }
    return 'Successfully set user.';
  }

  async delete(id){
    let result;
    try{
      const idQuery = `SELECT id FROM schema1.users WHERE id = $1`;
      const values = [id];
      result = await database.query(idQuery, values);
    }
    catch(error){
      throw new Error('Failed due to no users table, no database connection, or invalid inputs.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered id does not exist in users table.');
    }

    try{
      const deleteQuery = `DELETE FROM schema1.users WHERE id = ${result.rows[0].id}`;
      await database.query(deleteQuery);
      return 'Successfully deleted user.';
    } 
    catch(error){
      throw new Error('Failed due to other database tables are in a relationship.');
    }
  }

  async authenticate(username, password){
    let result;
    try{
      const query = `SELECT id, hashed_password FROM schema1.users WHERE pgp_sym_decrypt(username::bytea, '${REGULAR_ENCRYPTION_KEY}') = $1`;
      const values = [username];
      result = await database.query(query, values);
    } 
    catch(error){
      throw new Error('Failed due to no users table or no database connection.');
    }

    if(result.rows.length === 0){
      throw new Error('Failed due to entered username does not exist in users table.');
    }
    if(! await compareHash(password, result.rows[0].hashed_password)){
      throw new Error('Failed due to entered password not matching for user.');
    }
    return createToken({ user_id: result.rows[0].id });
  }
}

module.exports = UsersModel;