const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.post("", (req, res) => {
  const currentDate = new Date();

  const query = `INSERT INTO blog(title, content, createdat) VALUES($1, $2, $3);`;
  const values = [req.body.title, req.body.content, currentDate];

  client.query(query, values, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.redirect("/blogs");
  });
});

module.exports = router;
