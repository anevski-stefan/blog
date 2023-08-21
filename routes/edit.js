const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.post("/blogs/:blogId/edit", (req, res) => {
  const blogId = req.params.blogId;
  const title = req.body.title;
  const content = req.body.content;

  const query = `
    UPDATE blog
    SET title = $1,
        content = $2
    WHERE id = $3;
  `;

  const values = [title, content, blogId];

  client.query(query, values, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.redirect("/blogs");
  });
});

module.exports = router;
