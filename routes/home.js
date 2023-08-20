const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("", (req, res) => {
  const query = `SELECT *, 
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

  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.render("index", { blogs: result.rows });
  });
});

module.exports = router;
