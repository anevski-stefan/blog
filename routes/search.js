const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("/search/:term", (req, res) => {
  const term = req.params.term;
  const query = `SELECT * FROM blog WHERE title ~* $1 OR content ~* $1;`;
  client.query(query, [term], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.render("search-result", { blogs: result.rows });
  });
});

router.get("/search", (req, res) => {
  res.redirect("/blogs");
});

module.exports = router;
