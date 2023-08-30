const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const client = require("../database/database.js");
const passportFile = require("../config/passport.js");
const passport = require("passport");
const flash = require("express-flash");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../config/middleware.js");

router.use(flash());

router.use(passport.initialize());
router.use(passport.session());

// Blocking user route
router.post("/:idBlockedUser/:idBlockingUser", (req, res) => {
  const blockingUserId = req.params.idBlockingUser;
  const blockedUserId = req.params.idBlockedUser;
  const query = `
  INSERT INTO blog_blockedUsers(id_blockingUser, id_blockedUser)
  VALUES($1, $2);
`;
  client.query(query, [blockingUserId, blockedUserId], (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    req.flash("userBlocked", "User blocked successfully");
    res.redirect("/blogs");
  });
});

router.post("/follow/:idFollowedUser/:idFollowingUser", (req, res) => {
  const idFollowedUser = req.params.idFollowedUser;
  console.log(idFollowedUser);
  const idFollowingUser = req.params.idFollowingUser;
  console.log(idFollowingUser);

  const query = `INSERT INTO blog_followedusers(id_followinguser, id_followeduser) VALUES($1, $2);`;
  client.query(query, [idFollowingUser, idFollowedUser], (err, result) => {
    if (err) {
      console.log("Err: ", err.message);
      return;
    }
    req.flash("userFollowed", "User followed successfully");
    res.redirect("/blogs");
  });
});

// Edit & Delete users from Admin page
router.get("/admin/:userId/delete", (req, res) => {
  const userId = req.params.userId;
  const query = `DELETE FROM bloguser WHERE id = ${userId}`;
  client.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    res.redirect("/admin/allUsers");
  });
});

// GET Request: Show login & register pages

router.get("/login", checkNotAuthenticated, (req, res) => {
  const messages = {
    loggedout: req.flash("loggedout"),
    createdAcc: req.flash("createdAcc"),
  };

  res.render("login", { messages: messages });
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

    const query = `INSERT INTO bloguser(firstname, lastname, username, password) VALUES($1, $2, $3, $4)`;
    const values = [first_name, last_name, username, hashedPassword];
    client.query(query, values, (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      req.flash("createdAcc", "You have successfully created your account!");
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
    failureFlash: true,
  }),
  (req, res) => {
    req.session.username = req.user.username;
    res.redirect("/blogs");
  }
);

router.get("/logout", checkAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
    }
    req.flash("loggedout", "You have successfully logged out!");
    res.redirect("/login");
  });
});

router.get("/success", (req, res) => {
  res.render("profile.ejs");
});

router.use(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/success");
  }
);

router.use(checkAuthenticated, require("./dashboard.js"));

module.exports = router;
