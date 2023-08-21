const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("", (req, res) => {
  const query = "SELECT * FROM category";
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.render("add-blog-form", { categories: result.rows });
  });
});

module.exports = router;
