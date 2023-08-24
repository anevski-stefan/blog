const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const client = require("../database/database.js");
const passport = require("../config/passport.js");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../config/middleware.js");

// GET Request: Show login & register pages

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

// Post Request: Register a user
router.post("/register", checkNotAuthenticated, async (req, res) => {
  const first_name = req.body.fname;
  const last_name = req.body.lname;
  const username = req.body.username;
  const password = req.body.password;
  try {
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

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login",
    failureFlash: false,
  }),
  (req, res) => {
    req.session.username = req.user.username; // Store the username in the session
    res.redirect("/blogs");
  }
);

router.get("/logout", checkAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle the error
      console.error("Error logging out:", err);
    }
    res.redirect("/login");
  });
});

router.use(checkAuthenticated, require("./dashboard.js"));

module.exports = router;
