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

router.post("/blogs/:blogId/edit", (req, res) => {
  const blogId = req.params.blogId;
  const title = req.body.title;
  const content = req.body.content;

  const query = `
    UPDATE blog
    SET title = $1,
        content = $2
    WHERE id = $3;
  `;

  const values = [title, content, blogId];

  client.query(query, values, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    req.flash("edited", "Blog edited successfully!");
    res.redirect("/blogs");
  });
});

module.exports = router;
