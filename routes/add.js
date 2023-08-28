const express = require("express");
const router = express.Router();
const client = require("../database/database.js");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
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

router.post("/blogs/add", (req, res) => {
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
    req.flash("success", "Blog created successfully!");
    res.redirect("/blogs?message=success");
  });
});

module.exports = router;
