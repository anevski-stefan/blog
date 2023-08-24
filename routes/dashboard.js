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

router.post("/:username/update", (req, res) => {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const username = req.params.username;

  const query =
    "UPDATE bloguser SET firstname = $1, lastname = $2 WHERE username = $3";
  client.query(query, [firstname, lastname, username], (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log("User information updated successfully.");
    res.redirect(`/${username}/dashboard`);
  });
});

module.exports = router;
