require("dotenv").config();
const mysql = require("mysql2");
const express = require("express");
const connectDB = require('./db'); 

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

let connection;

app.listen(port, async () => {
  try {
    connection = await connectDB();
    console.log(`App is running at: http://localhost:${port}`);
  } catch (error) {
    console.error('Failed to connect to the database. Server not started.');
    process.exit(1);
  }
});


app.get("/status", async (req, res) => {
  const query = "show tables";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.json("Internal Error");
    }
    if(results){
      res.json("Success");
    }
  });
});

app.get("/", async (req, res) => {
  const query = "select * from banneritems where expiration_time > now()";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.json({data:[]});
    }else{
      res.json(results);
    }
  });
});

process.on('SIGINT', async () => {
  if (connection) {
    await connection.end();
    console.log('Database connection closed.');
  }
  process.exit(0);
});
