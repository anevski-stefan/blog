const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.post("/:blogId/addComment", (req, res) => {
  const comment_content = req.body.leaveComment;
  const blog_id = req.params.blogId;
  const user_id = res.locals.user.id;
  const query = `INSERT INTO blog_comment(content, id_blog, id_user) VALUES('${comment_content}', ${blog_id}, ${user_id});`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.redirect(`/blogs/${blog_id}`);
  });
});

module.exports = router;
