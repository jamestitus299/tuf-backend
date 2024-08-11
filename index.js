import express from "express";
import mysql from 'mysql2/promise';
import {Connector} from '@google-cloud/cloud-sql-connector';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3003;

const instanceConnectionName = process.env.instanceConnectionName;
const user = process.env.user;
const password = process.env.password;
const database = process.env.databaseName;


const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: instanceConnectionName,
  ipType: 'PUBLIC',
});
const pool = await mysql.createPool({
  ...clientOpts,
  user:  user,
  password:  password,
  database:  database,
});
const conn = await pool.getConnection();
const [result] = await conn.query(`SELECT NOW();`);
console.table(result); // prints returned time value from server

await pool.end();
connector.close();


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// start
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
