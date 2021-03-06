// Update with your config settings.
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
      multipleStatements: true,
    },
  },

  production: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
      multipleStatements: true,
    },
    pool: {
      min: 0,
      max: 10,
    },
  },
};
