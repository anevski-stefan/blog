const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("", (req, res) => {
  const query = `SELECT blog.*, category.name as category_name FROM blog 
  LEFT JOIN category on blog.category_id = category.id 
  order by blog.id asc`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }

    res.render("blogs", { blogs: result.rows });
  });
});

module.exports = router;
