const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("/blogs/:blogId", (req, res) => {
  const blogId = req.params.blogId;
  const query = `SELECT 
  blog.*, 
  bloguser.username,
  category.name AS category_name, 
  COALESCE(like_counts.like_count, 0) AS like_count, 
  COALESCE(dislike_counts.dislike_count, 0) AS dislike_count 
FROM 
  blog 
LEFT JOIN 
  category ON blog.category_id = category.id 
LEFT JOIN 
  bloguser ON blog.user_id = bloguser.id
LEFT JOIN (
  SELECT 
    id_blog, 
    COUNT(*) AS like_count 
  FROM 
    blog_like 
  WHERE
    id_blog = ${blogId}
  GROUP BY 
    id_blog
) AS like_counts ON blog.id = like_counts.id_blog
LEFT JOIN (
  SELECT 
    id_blog, 
    COUNT(*) AS dislike_count 
  FROM 
    blog_dislike 
  WHERE
    id_blog = ${blogId}
  GROUP BY 
    id_blog
) AS dislike_counts ON blog.id = dislike_counts.id_blog
WHERE
  blog.id = ${blogId};`;
  const allComments = `
  SELECT c.*, u.username
  FROM blog_comment AS c
  JOIN bloguser AS u ON c.id_user = u.id
  WHERE c.id_blog = ${blogId};
`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    client.query(allComments, (err, result2) => {
      if (err) {
        console.log(err.message);
        return;
      }

      res.render("detail-blog-view", {
        blog: result.rows[0],
        comments: result2.rows,
      });
    });
  });
});

module.exports = router;
