const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("/blogs/:blogId/remove", (req, res) => {
  const blogId = req.params.blogId;
  //   console.log("Deleting post with id:", blogId);
  const query = `DELETE FROM blog WHERE id=${blogId};`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }

    res.redirect("/blogs");
  });
});

module.exports = router;
