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

router.get("/blogs/:blogId/remove", (req, res) => {
  const blogId = req.params.blogId;
  const query = `DELETE FROM blog WHERE id=${blogId};`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    req.flash("deleted", "Blog deleted successfully!");
    res.redirect(`/blogs`);
  });
});

module.exports = router;
