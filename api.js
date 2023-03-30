const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 3000;

// Set up MySQL connection
const connection = mysql.createConnection({
  host: "db4free.net",
  user: "markbosire",
  password: "09kumamoto.",
  database: "igredesign",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

// Set up middleware
app.use(bodyParser.json());

// GET all comments
app.get("/comments", (req, res) => {
  const query = "SELECT * FROM comments";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error retrieving comments from database.");
    } else {
      res.status(200).send(results);
    }
  });
});

// POST a new comment
app.post("/comments", (req, res) => {
  const { email, commentdate, comment, postid } = req.body;
  const query = `INSERT INTO comments (email, commentdate, comment, postid) VALUES ('${email}', '${commentdate}', '${comment}', '${postid}')`;

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error inserting comment into database.");
    } else {
      const newCommentId = result.insertId;
      res
        .status(201)
        .send({ message: "Comment added successfully!", newCommentId });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
module.exports = app;
