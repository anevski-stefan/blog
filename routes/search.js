const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("/search/:term", (req, res) => {
  const term = req.params.term;
  const query = `SELECT blog.*,   bloguser.username AS blog_username
  , category.name AS category_name
  FROM blog
  LEFT JOIN bloguser ON blog.user_id = bloguser.id
  LEFT JOIN category ON blog.category_id = category.id
  WHERE blog.title ~* $1 OR blog.content ~* $1;`;
  const categories = "SELECT * FROM category";
  const latest = `SELECT *, 
  COALESCE(like_counts.like_count, 0) AS like_count, 
  COALESCE(dislike_counts.dislike_count, 0) AS dislike_count 
  FROM blog LEFT JOIN (
    SELECT 
      id_blog, 
      COUNT(*) AS like_count 
    FROM 
      blog_like 
    GROUP BY 
      id_blog
  ) AS like_counts ON blog.id = like_counts.id_blog
  LEFT JOIN (
    SELECT 
      id_blog, 
      COUNT(*) AS dislike_count 
    FROM 
      blog_dislike 
    GROUP BY 
      id_blog
  ) AS dislike_counts ON blog.id = dislike_counts.id_blog
  ORDER BY createdat DESC LIMIT 5;`;
  client.query(query, [term], (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }

    client.query(categories, (err, result2) => {
      if (err) {
        console.log(err.message);
        return;
      }

      client.query(latest, (err, result3) => {
        if (err) {
          console.log(err.message);
          return;
        }
        res.render("blogs", {
          blogs: result.rows,
          categories: result2.rows,
          latest: result3.rows,
        });
      });
    });
  });
});

router.get("/search", (req, res) => {
  res.redirect("/blogs");
});

module.exports = router;
