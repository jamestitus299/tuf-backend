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
    "select * from banneritems where expiration_time > now() order by expiration_time";
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


app.post("/admin/banner", async (req, res) => {
  const { title, description, link, expirationTime, active } = req.body;
  if (!title || !description || !link || !expirationTime) {
    return res.status(400).json({ message: "Missing fields" });
  }
  // const eTime = new Date(expirationTime).toISOString().slice(0, 19).replace('T', ' ');
  const currentTime = new Date();
  // console.log(title, description, link, expirationTime, active, currentTime );

  const sql = "insert into banneritems(title, description, link, expiration_time, is_active, created_time ) values(?, ?, ?, ?, ?, ?)";
  connection.query(sql, [title, description, link, expirationTime, active, currentTime ], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Error" });
    }
      return res.status(200).json({ message: 'Banner Created'});
  });
});

app.post("/admin/banner/edit", async (req, res) => {

  const {id, title, description, link, expirationTime } = req.body;
  // console.log(id, title, description, link );

  if (!title || !description || !link ) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const query = "update banneritems set title = ?, description = ?, link = ? where id = ?";
  connection.query(query, [title, description, link, id], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Error" });
    }
      // console.log(results);
      res.status(200).json({ message: 'Banner Edited'});
  });
});


app.post("/admin/togglebanner", async (req, res) => {

  const {id, active} = req.body;
  // console.log(id, active);

  const query = "update banneritems set is_active = ? where id = ?";
  connection.query(query, [active, id], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Error" });
    }
      res.status(200).json({ message: 'Banner Toggled'});
  });
});






process.on("SIGINT", async () => {
  if (connection) {
    await connection.end();
    console.log("Database connection closed.");
  }
  process.exit(0);
});
