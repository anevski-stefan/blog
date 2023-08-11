const express = require("express");
const router = express.Router();
const client = require("../database/database.js");
const app = express();

router.get("", (req, res) => {
  const query = `SELECT * FROM blog`;
  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    res.render("blogs", { blogs: result.rows });
  });
});

module.exports = router;
