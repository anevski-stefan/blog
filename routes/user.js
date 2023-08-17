const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const client = require("../database/database.js");

// GET Request: Show login & register pages

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

// Post Request: Register a user
router.post("/register", async (req, res) => {
  const first_name = req.body.fname;
  const last_name = req.body.lname;
  const username = req.body.username;
  const password = req.body.password;
  try {
    // Hashing the password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO blogUser(firstname, lastname, username, password) VALUES($1, $2, $3, $4)`;
    const values = [first_name, last_name, username, hashedPassword];
    client.query(query, values, (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      res.redirect("/login");
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
