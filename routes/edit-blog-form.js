const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("/blogs/:blogId/edit-form", (req, res) => {
  const blogId = req.params.blogId;
  const query = `SELECT * FROM blog WHERE id=${blogId};`;
  const categories = "SELECT * FROM category";
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
    }

    client.query(categories, (err2, result2) => {
      if (err2) {
        console.log(err2.message);
        return;
      }

      const categoryId = result.rows[0].category_id;
      console.log("Category Id: ", categoryId);
      const category = `SELECT * FROM category WHERE id=${categoryId}`;
      client.query(category, (err3, result3) => {
        if (err3) {
          console.log(err3.message);
          return;
        }
        res.render("edit-blog-form", {
          blog: result.rows[0],
          categories: result2.rows,
          category_id: result3.rows[0],
        });
      });
    });
  });
});

module.exports = router;
