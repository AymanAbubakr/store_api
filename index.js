const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const connection = require('./utils/connection');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Server will shut down');
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('welcome to new server');
});

connection.connect((err) => {
  if (err) console.log(err.message);
  console.log('connected to db');
});

//for error Promises in Server.js
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION: Server will shut down');
  server.close(() => {
    process.exit(1);
  });
});
