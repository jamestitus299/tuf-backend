require("dotenv").config();
const mysql = require("mysql2");
const express = require("express");

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

const connectionString = process.env.CONN_STRING;
const connection = mysql.createConnection(connectionString);

app.get("/status", async (req, res) => {
  const query = "show tables";
  connection.query(query, (err, results) => {
    if (err) throw err;
    // res.json((data = results[0]));
    if(results[0]){
      res.json("Success");
    }
  });
});

app.get("/", async (req, res) => {
  const query = "select * from banneritems where expiration_time > now()";
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json((data = results[0]));
  });
});

app.listen(port, () => {
  console.log(`App is running at: http://localhost:${port}`);
});

// connection.end();
