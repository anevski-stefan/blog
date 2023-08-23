const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.post("/blogs/:blogId/like", (req, res) => {
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
          return res.redirect(`/blogs/${blogId}`);
        });
      } else {
        return res.redirect(`/blogs/${blogId}`);
      }
    });
  });
});

router.post("/blogs/:blogId/dislike", (req, res) => {
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
          return res.redirect(`/blogs/${blogId}`);
        });
      } else {
        return res.redirect(`/blogs/${blogId}`);
      }
    });
  }
});

module.exports = router;
