
const { Pool } = require('pg');

const { LOCAL_DATABASE_URL } = require('../../.env/secrets.js');

let database;

if(process.env.NODE_ENV === 'production'){
  database = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} 
else{
  database = new Pool({
    connectionString: LOCAL_DATABASE_URL
  });
}

database.query('SELECT NOW()')
  .catch((error) => {
    console.error('Error: Failed to connect to database', error)
  });

module.exports = database;
