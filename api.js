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
  const query = "SELECT * FROM comments ORDER BY comment_id DESC";

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
  console.log(`email ${email}`)
  const query = `INSERT INTO comments (email, commentdate, comment, postid) VALUES ('${email}', '${commentdate}', '${comment}', '${postid}')`;

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error inserting comment into database.",err);
    } else {
      const newCommentId = result.insertId;
      res
        .status(201)
        .send({ message: "Comment added successfully!", newCommentId });
    }
  });
});
app.put("/comments/:id", (req, res) => {
  const id = req.params.id;
  const { comment } = req.body;
  const query = `UPDATE comments SET comment='${comment}' WHERE comment_id=${id}`;

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error updating comment in database.");
    } else if (result.affectedRows === 0) {
      res.status(404).send(`Comment with ID ${id} not found.`);
    } else {
      res.status(200).send(`Comment with ID ${id} updated successfully!`);
    }
  });
});
app.delete("/comments/:id", (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM comments WHERE comment_id=${id}`;

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error deleting comment from database.");
    } else if (result.affectedRows === 0) {
      res.status(404).send(`Comment with ID ${id} not found.`);
    } else {
      res.status(200).send(`Comment with ID ${id} deleted successfully!`);
    }
  });
});
// GET endpoint to retrieve all likes
// GET endpoint to retrieve all likes
app.get('/likes', (req, res) => {
  const query = 'SELECT * FROM likes';

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error retrieving likes from database.");
    } else {
      res.status(200).send(result);
    }
  });
});

// POST endpoint to add a new like
app.post('/likes', (req, res) => {
  const { post_id, email } = req.body;
  const query = `INSERT INTO likes (post_id, email) VALUES ('${post_id}', '${email}')`;

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error adding like to database.");
    } else {
      res.status(201).send(`New like added with ID: ${result.insertId}`);
    }
  });
});


// DELETE endpoint to remove a like based on its ID
app.delete('/likes/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM likes WHERE likes_id=${id}`;

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error deleting like from database.");
    } else if (result.affectedRows === 0) {
      res.status(404).send(`Like with ID ${id} not found.`);
    } else {
      res.status(200).send(`Like with ID ${id} deleted successfully!`);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
module.exports = app;
