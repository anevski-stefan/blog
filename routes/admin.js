const express = require("express");
const router = express.Router();
const client = require("../database/database.js");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
const bcrypt = require("bcrypt");
const { checkAdmin } = require("../config/middleware.js");
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

router.get("/admin/categories/:categoryId/delete", checkAdmin, (req, res) => {
  const categoryId = req.params.categoryId;
  const query = `DELETE FROM category WHERE id=${categoryId};`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    req.flash("deleted", "Category deleted successfully!");
    res.redirect("/admin/allCategories");
  });
});

router.get("/admin/addCategory", checkAdmin, (req, res) => {
  res.render("admin-addCategory", { layout: "layouts/admin.ejs" });
});

router.get("/admin/allCategories", checkAdmin, (req, res) => {
  const query = `SELECT * FROM category;`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    const messages = {
      deleted: req.flash("deleted"),
      addedCat: req.flash("addedCat"),
      editedCat: req.flash("editedCat"),
    };
    res.render("admin-allCategories", {
      categories: result.rows,
      layout: "layouts/admin.ejs",
      messages: messages,
    });
  });
});

router.post("/admin/categories/add", checkAdmin, (req, res) => {
  const catName = req.body.catname;
  const query = `INSERT INTO category(name) VALUES('${catName}');`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    req.flash("addedCat", "Category added successfully!");
    res.redirect("/admin/allCategories");
  });
});

router.get("/admin/categories/:CatId/editPage", (req, res) => {
  const blogId = req.params.CatId;
  const query = `SELECT * FROM category WHERE id=${blogId}`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.render("editCategory", { category: result.rows[0] });
  });
});

router.post("/admin/categories/:CatId/edit", (req, res) => {
  const catId = req.params.CatId;
  const catName = req.body.catname;
  const query = "UPDATE category SET name = $1 WHERE id = $2";
  const values = [catName, catId];
  client.query(query, values, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    req.flash("editedCat", "Category edited successfully!");
    res.redirect("/admin/allCategories");
  });
});

router.get("/admin/allUsers", checkAdmin, (req, res) => {
  const query = `SELECT * FROM bloguser;`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    const messages = {
      addedUser: req.flash("addedUser"),
      removeUser: req.flash("removeUser"),
    };
    res.render("admin-allUsers", {
      layout: "layouts/admin.ejs",
      users: result.rows,
      messages: messages,
    });
  });
});

router.get("/admin/:idUser/deleteuser", (req, res) => {
  const idUser = req.params.idUser;
  const query = `DELETE FROM bloguser WHERE id=${idUser}`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    req.flash("removeUser", "User removed successfully!");
    res.redirect("/admin/allUsers");
  });
});

router.post("/admin/users/add", checkAdmin, async (req, res) => {
  const first_name = req.body.fname;
  const last_name = req.body.lname;
  const username = req.body.username;
  const password = req.body.password;
  try {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO bloguser(firstname, lastname, username, password) VALUES($1, $2, $3, $4)`;
    const values = [first_name, last_name, username, hashedPassword];
    client.query(query, values, (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      req.flash("addedUser", "User created successfully!");
      res.redirect("/admin/allUsers");
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/admin/:blogId/remove", (req, res) => {
  const blogId = req.params.blogId;
  const query = `DELETE FROM blog WHERE id = ${blogId}`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    req.flash("removedBlog", "Blog removed successfully!");
    res.redirect("/admin/allBlogs");
  });
});

router.post("/admin/blogs/add", checkAdmin, (req, res) => {
  const title = req.body.title;
  const content = DOMPurify.sanitize(req.body.content);
  const category_id = req.body.category;
  const date = new Date();
  const user_id = req.user.id;
  const query =
    "INSERT INTO blog(title, content, createdat, category_id, user_id) VALUES($1, $2, $3, $4, $5)";
  const values = [title, content, date, category_id, user_id];
  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    req.flash("addedBlog", "Blog added successfully!");
    res.redirect("/admin/allBlogs");
  });
});

router.get("/admin/users/addForm", checkAdmin, (req, res) => {
  res.render("admin-addUser", {
    layout: "layouts/admin.ejs",
  });
});
router.get("/admin/blogs/addForm", checkAdmin, (req, res) => {
  const categories = `SELECT * FROM category;`;
  client.query(categories, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }

    res.render("admin-addBlog", {
      layout: "layouts/admin.ejs",
      categories: result.rows,
    });
  });
});

router.get("/admin/allLikesDislikes", checkAdmin, (req, res) => {
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
    const messages = {
      addedLike: req.flash("addedLike"),
      addedDislike: req.flash("addedDislike"),
    };
    res.render("admin-allLikesDislikes", {
      layout: "layouts/admin.ejs",
      reactions: result.rows,
      messages: messages,
    });
  });
});

router.get("/admin/allComments", checkAdmin, (req, res) => {
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

router.post("/admin/blogs/:blogId/like", checkAdmin, (req, res) => {
  const blogId = req.params.blogId;
  const userId = req.user.id;

  const deleteDislikeQuery = `DELETE FROM blog_dislike WHERE id_user = ${userId} AND id_blog = ${blogId}`;
  client.query(deleteDislikeQuery, (deleteDislikeErr, deleteDislikeResult) => {
    if (deleteDislikeErr) {
      console.log(deleteDislikeErr.message);
      return;
    }

    const checkQuery = `SELECT * FROM blog_like WHERE id_user = ${userId} AND id_blog = ${blogId}`;
    client.query(checkQuery, (checkErr, checkResult) => {
      if (checkErr) {
        console.log(checkErr.message);
        return;
      }

      if (checkResult.rows.length === 0) {
        const likeQuery = `INSERT INTO blog_like(id_user, id_blog) VALUES(${userId}, ${blogId})`;
        client.query(likeQuery, (insertErr, insertResult) => {
          if (insertErr) {
            console.log(insertErr.message);
            return;
          }
          req.flash("addedLike", "Blog successfully liked!");
          return res.redirect(`/admin/allBlogs`);
        });
      } else {
        return res.redirect(`/admin/allBlogs`);
      }
    });
  });
});
router.post("/admin/blogs/:blogId/dislike", checkAdmin, (req, res) => {
  const blogId = req.params.blogId;
  const userId = req.user.id;

  const checkLikeQuery = `SELECT * FROM blog_like WHERE id_user = ${userId} AND id_blog = ${blogId}`;
  client.query(checkLikeQuery, (checkLikeErr, checkLikeResult) => {
    if (checkLikeErr) {
      console.log(checkLikeErr.message);
      return;
    }

    if (checkLikeResult.rows.length > 0) {
      const deleteQuery = `DELETE FROM blog_like WHERE id_user = ${userId} AND id_blog = ${blogId}`;
      client.query(deleteQuery, (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.log(deleteErr.message);
          return;
        }
        req.flash("addedDislike", "Blog successfully disliked!");
        insertDislike();
      });
    } else {
      insertDislike();
    }
  });

  function insertDislike() {
    const checkDislikeQuery = `SELECT * FROM blog_dislike WHERE id_user = ${userId} AND id_blog = ${blogId}`;
    client.query(checkDislikeQuery, (checkDislikeErr, checkDislikeResult) => {
      if (checkDislikeErr) {
        console.log(checkDislikeErr.message);
        return;
      }

      if (checkDislikeResult.rows.length === 0) {
        const dislikeQuery = `INSERT INTO blog_dislike(id_user, id_blog) VALUES(${userId}, ${blogId})`;
        client.query(dislikeQuery, (dislikeErr, dislikeResult) => {
          if (dislikeErr) {
            console.log(dislikeErr.message);
            return;
          }
          return res.redirect(`/admin/allBlogs`);
        });
      } else {
        return res.redirect(`/admin/allBlogs`);
      }
    });
  }
});

router.get("/admin/allBlogs", checkAdmin, (req, res) => {
  const query = `
    SELECT 
      blog.id AS blog_id, 
      blog.title AS blog_title, 
      blog.content AS blog_content,
      category.name AS category_name,
      bloguser.username AS user_username,
      COALESCE(blog_likes.like_count, 0) AS like_count,
      COALESCE(blog_dislikes.dislike_count, 0) AS dislike_count
    FROM blog 
    JOIN category ON blog.category_id = category.id 
    JOIN bloguser ON blog.user_id = bloguser.id
    LEFT JOIN (
      SELECT id_blog, COUNT(*) AS like_count
      FROM blog_like
      GROUP BY id_blog
    ) AS blog_likes ON blog.id = blog_likes.id_blog
    LEFT JOIN (
      SELECT id_blog, COUNT(*) AS dislike_count
      FROM blog_dislike
      GROUP BY id_blog
    ) AS blog_dislikes ON blog.id = blog_dislikes.id_blog;
  `;

  client.query(query, (err, result) => {
    if (err) {
      console.log("Err1: ", err.message);
      return;
    }
    const messages = {
      addedBlog: req.flash("addedBlog"),
      removedBlog: req.flash("removedBlog"),
    };
    res.render("admin-allBlogs", {
      layout: "layouts/admin.ejs",
      blogs: result.rows,
      messages: messages,
    });
  });
});

router.get("/admin", checkAdmin, (req, res) => {
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
