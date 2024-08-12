const express = require("express");
const connectDB = require("./db");
require("dotenv").config();

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;
let connection;

app.listen(port, async () => {
  try {
    connection = await connectDB();
    console.log(`App is running at: http://localhost:${port}`);
  } catch (error) {
    console.error("Failed to connect to the database. Server not started.");
    process.exit(1);
  }
});

app.get("/status", async (req, res) => {
  const query = "show tables";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json("Internal Error");
    }
    if (results) {
      res.status(200).json("Success");
    }
  });
});

app.get("/", async (req, res) => {
  const query =
    "select * from banneritems where expiration_time > now() and is_active = 1 order by expiration_time";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ data: [] });
    }
    if (results.length > 0) {
      res.status(200).send(results);
    } else {
      res.status(500).send([]);
    }
  });
});

app.get("/admin", async (req, res) => {
  const query =
    "select * from banneritems order by expiration_time";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ data: [] });
    }
    if (results.length > 0) {
      res.status(200).send(results);
    } else {
      res.status(500).send([]);
    }
  });
});

app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND pass = ?";
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Internal Error" });
    }
    if (!results.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: "Login successful" });
  });
});

process.on("SIGINT", async () => {
  if (connection) {
    await connection.end();
    console.log("Database connection closed.");
  }
  process.exit(0);
});
