require('dotenv').config()

const mysql = require('mysql2');
const express = require('express');
const app = express();
app.use(express.json())

// Use port 8080 by default, unless configured differently in Google Cloud
const port = process.env.PORT || 8080;
app.listen(port, () => {
   console.log(`App is running at: http://localhost:${port}`);
});

const pool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  databse: process.env.DB_NAME,
  socketPath: `/cloudsql/${process.env.INSTANCE_CONN_NAME}`,
});

// console.log(pool);

app.get('/status', async (req, res) => res.send('Success.') );

app.get('/', async (req, res) => {
  try {
    const [rows, fields] = await pool.execute(query);
    res.json({ data: rows }); // Send the results as JSON
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});


