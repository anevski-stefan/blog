const express = require("express");
const router = express.Router();
const client = require("../database/database.js");
const session = require("express-session");
const flash = require("express-flash");

router.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
router.use(flash());

router.get("", (req, res) => {
  const query = `
  SELECT 
  DISTINCT blog.*, 
  category.name AS category_name,
  bloguser.username AS blog_username,
  bloguser.id AS blog_id
FROM 
  blog 
LEFT JOIN 
  category ON blog.category_id = category.id
LEFT JOIN
  bloguser ON blog.user_id = bloguser.id
LEFT JOIN
  blog_followedusers ON blog_followedusers.id_followeduser = blog.user_id
WHERE (bloguser.username = $1) OR (bloguser.id = blog_followedusers.id_followeduser)
ORDER BY createdat DESC;`;
  const blogValues = [req.user.username];
  console.log(req.user.username);

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
  const sessionUsername = req.session.username;

  client.query(query, blogValues, (err, result) => {
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
        const messages = {
          success: req.flash("success"),
          deleted: req.flash("deleted"),
          edited: req.flash("edited"),
          loggedout: req.flash("loggedout"),
        };

        res.render("blogs", {
          blogs: result.rows,
          categories: result2.rows,
          latest: result3.rows,
          sessionUsername: sessionUsername,
          messages: messages,
        });
      });
    });
  });
});

module.exports = router;
