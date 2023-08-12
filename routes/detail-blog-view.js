const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("/blogs/:blogId", (req, res) => {
  const blogId = req.params.blogId;
  console.log(blogId);
  const query = `SELECT * FROM blog WHERE id=${blogId};`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.render("detail-blog-view", { blog: result.rows[0] });
  });
});

module.exports = router;
