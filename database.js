require('dotenv').config();
const mysql = require('mysql2');

const connectionString = process.env.CONN_STRING;

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection(connectionString);
    console.log('Connected to the database.');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error.stack);
    throw error;
  }
};

module.exports = connectDB;
