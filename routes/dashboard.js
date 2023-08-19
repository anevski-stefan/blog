const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("/:username/dashboard", (req, res) => {
  const username = req.params.username;
  const query = "SELECT * FROM bloguser WHERE username = $1";

  client.query(query, [username], (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.render("dashboard", { user: result.rows[0] });
  });
});

module.exports = router;
