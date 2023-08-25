const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("/admin/allLikesDislikes", (req, res) => {
  const query = `
  SELECT
    b.id AS blog_id,
    b.title AS blog_title,
    bu.id AS user_id,
    bu.username,
    'Like' AS reaction
  FROM
    blog_like bl
  JOIN
    bloguser bu ON bl.id_user = bu.id
  JOIN
    blog b ON bl.id_blog = b.id
  UNION ALL
  SELECT
    bd.id_blog AS blog_id,
    b.title AS blog_title,
    bu.id AS user_id,
    bu.username,
    'Dislike' AS reaction
  FROM
    blog_dislike bd
  JOIN
    bloguser bu ON bd.id_user = bu.id
  JOIN
    blog b ON bd.id_blog = b.id
  ORDER BY
    blog_id,
    user_id,
    reaction;`;
  client.query(query, (err, result) => {
    if (err) {
      console.log("Err1: ", err.message);
      return;
    }
    res.render("admin-allLikesDislikes", {
      layout: "layouts/admin.ejs",
      reactions: result.rows,
    });
  });
});

router.get("/admin/allComments", (req, res) => {
  const query = `
  SELECT 
  blog_comment .id AS comment_id, 
    blog_comment.content AS comment_content, 
    blog_comment.id_blog AS comment_idBlog,
    blog_comment.id_user AS comment_user,
    blog.title AS blog_title,
    bloguser.username AS user_username
  FROM blog_comment 
  JOIN blog ON blog_comment.id_blog = blog.id 
  JOIN bloguser ON blog_comment.id_user = bloguser.id;
`;
  client.query(query, (err, result) => {
    if (err) {
      console.log("Err1: ", err.message);
      return;
    }
    res.render("admin-allComments", {
      layout: "layouts/admin.ejs",
      comments: result.rows,
    });
  });
});

router.get("/admin/allBlogs", (req, res) => {
  const query = `
  SELECT 
    blog.id AS blog_id, 
    blog.title AS blog_title, 
    blog.content AS blog_content,
    category.name AS category_name,
    bloguser.username AS user_username
  FROM blog 
  JOIN category ON blog.category_id = category.id 
  JOIN bloguser ON blog.user_id = bloguser.id;
`;
  client.query(query, (err, result) => {
    if (err) {
      console.log("Err1: ", err.message);
      return;
    }
    res.render("admin-allBlogs", {
      layout: "layouts/admin.ejs",
      blogs: result.rows,
    });
  });
});

router.get("/admin/allUsers", (req, res) => {
  const query = `SELECT * FROM bloguser;`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.render("admin-allUsers", {
      layout: "layouts/admin.ejs",
      users: result.rows,
    });
  });
});

router.get("/admin", (req, res) => {
  const usersQuery = `SELECT COUNT(*) AS user_count, id, firstname, lastname, username FROM bloguser GROUP BY id, firstname, lastname, username ORDER BY id, firstname, lastname, username;`;
  const blogsQuery = `SELECT COUNT(*) AS blog_count FROM blog;`;
  const commentsQuery = `SELECT COUNT(*) AS comment_count FROM blog_comment;`;
  const categoriesQuery = `SELECT COUNT(*) AS category_count FROM category;`;

  client.query(usersQuery, (err1, result1) => {
    if (err1) {
      console.log("Err1: ", err1.message);
      return;
    }
    client.query(blogsQuery, (err2, result2) => {
      if (err2) {
        console.log("Err2: ", err2.message);
        return;
      }

      client.query(commentsQuery, (err3, result3) => {
        if (err3) {
          console.log("Err3: ", err3.message);
          return;
        }

        client.query(categoriesQuery, (err4, result4) => {
          if (err4) {
            console.log("Err4: ", err4.message);
            return;
          }

          // Retrieve blog details
          const blogsDetailsQuery = `SELECT id, title, category_id, user_id  FROM blog group by id, title, category_id, user_id;`;
          client.query(blogsDetailsQuery, (err5, result5) => {
            if (err5) {
              console.log("Err5: ", err5.message);
              return;
            }

            // Retrieve comment details
            const commentsDetailsQuery = `SELECT id, id_blog, content, id_user FROM blog_comment group by id, id_blog, content, id_user;`;
            client.query(commentsDetailsQuery, (err6, result6) => {
              if (err6) {
                console.log("Err6: ", err6.message);
                return;
              }

              // Retrieve category details
              const categoriesDetailsQuery = `SELECT id, name FROM category order by id, name;`;
              client.query(categoriesDetailsQuery, (err7, result7) => {
                if (err7) {
                  console.log("Err7: ", err7.message);
                  return;
                }

                res.render("admin", {
                  layout: "layouts/admin.ejs",
                  user: req.user,
                  userCount: result1.rows[0].user_count,
                  users: result1.rows,
                  blogCount: result2.rows[0].blog_count,
                  blogs: result5.rows,
                  commentCount: result3.rows[0].comment_count,
                  comments: result6.rows,
                  categoryCount: result4.rows[0].category_count,
                  categories: result7.rows,
                });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
