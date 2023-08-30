const express = require("express");
const router = express.Router();
const client = require("../database/database.js");

router.get("/:username/dashboard", (req, res) => {
  const username = req.params.username;
  const loggedInUser = req.user;
  const query = `SELECT *,
  COALESCE(bloguser.id) AS id FROM bloguser 
LEFT JOIN 
  blog_followedusers ON blog_followedusers.id_followinguser = bloguser.id
WHERE 
  bloguser.username = $1;`;
  const numFollowing = `SELECT count(blog_followedusers.id_followinguser) as followed
  FROM bloguser 
  LEFT JOIN 
    blog_followedusers ON blog_followedusers.id_followeduser = bloguser.id
  WHERE 
    bloguser.username = $1`;

  client.query(query, [username], (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    client.query(numFollowing, [username], (err2, result2) => {
      if (err2) {
        console.log(err2.message);
        return;
      }
      console.log(result2.rows[0]["followed"]);
      const messages = {
        updatedInfo: req.flash("updatedInfo"),
      };

      res.render("dashboard", {
        user: result.rows[0],
        loggedInUser: loggedInUser,
        messages: messages,
        numFollowed: result2.rows[0]["followed"],
      });
    });
  });
});

router.post("/:username/update", (req, res) => {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const username = req.params.username;
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

  const query =
    "UPDATE bloguser SET firstname = $1, lastname = $2 WHERE username = $3";
  client.query(query, [firstname, lastname, username], (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    req.flash("updatedInfo", "User info successfully updated!");
    res.redirect(`/${username}/dashboard`);
  });
});

module.exports = router;
