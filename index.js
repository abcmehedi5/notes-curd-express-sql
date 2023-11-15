const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "express_curd",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// create api  start -----------------------------------------
// Create
app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  const sql = "INSERT INTO notes (title, content) VALUES (?, ?)";
  db.query(sql, [title, content], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, title, content });
  });
});

// Read
app.get("/notes", (req, res) => {
  const sql = "SELECT * FROM notes";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update
app.put("/notes/:id", (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const sql = "UPDATE notes SET title=?, content=? WHERE id=?";
  db.query(sql, [title, content, id], (err, result) => {
    if (err) throw err;
    res.json({ id, title, content });
  });
});

// Delete
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM notes WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Note deleted successfully", id });
  });
});
// create api  end -------------------------------------------
// Start server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
