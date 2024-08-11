const express = require("express");
const connectDB = require('./db'); 
require("dotenv").config();

const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors())

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
      res.status(500).send("Internal Error");
    }
    if(results){
      res.status(200).json("Success");
    }
  });
});

app.get("/", async (req, res) => {
  const query = "select * from banneritems where expiration_time > now() and is_active = 1 order by expiration_time";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({data:[]});
    }
    if(results.length > 0){
      res.status(200).send(results);
    }
    else{
      res.status(500).send([]);
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
