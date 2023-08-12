const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("", (req, res) => {
  const successMessage = req.query.successMessage || null;

  const query = `SELECT * FROM blog order by id asc`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.render("blogs", { blogs: result.rows, successMessage });
  });
});

module.exports = router;
