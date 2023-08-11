const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("/blogs/:blogId/edit-form", (req, res) => {
  const blogId = req.params.blogId;
  const query = `SELECT * FROM blog WHERE id=${blogId};`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
    }
    // console.log(result.rows);
    res.render("edit-blog-form", { blog: result.rows[0] });
  });
});

module.exports = router;
