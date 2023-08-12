const express = require("express");
const router = express.Router();
const client = require("../database/database.js");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

router.post("/blogs/add", (req, res) => {
  const title = req.body.title;
  const content = DOMPurify.sanitize(req.body.content);
  const date = new Date();
  const query =
    "INSERT INTO blog(title, content, createdat) VALUES($1, $2, $3)";
  const values = [title, content, date];
  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    res.redirect("/blogs");
  });
});

module.exports = router;
