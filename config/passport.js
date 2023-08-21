const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const client = require("../database/database.js");
const bcrypt = require("bcrypt"); // Don't forget to require bcrypt here

passport.use(
  new LocalStrategy((username, password, done) => {
    // console.log("LocalStrategy: Attempting authentication...");

    client.query(
      "SELECT * FROM bloguser WHERE username = $1",
      [username],
      async (err, result) => {
        if (err) {
          console.error(
            "LocalStrategy: Error while querying the database:",
            err
          );
          return done(err);
        }

        if (!result.rows[0]) {
          console.log("LocalStrategy: User not found.");
          return done(null, false, { message: "Incorrect username." });
        }

        const user = result.rows[0];

        try {
          if (await bcrypt.compare(password, user.password)) {
            // console.log("password: ", password);
            // console.log("user.password: ", user.password);
            return done(null, user);
          } else {
            // console.log("LocalStrategy: Incorrect password.");
            return done(null, false, { message: "Incorrect password." });
          }
        } catch (error) {
          console.error(
            "LocalStrategy: Error during password comparison:",
            error
          );
          return done(error);
        }
      }
    );
  })
);

passport.serializeUser((user, done) => {
  // console.log("serializeUser:", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // console.log("deserializeUser: Retrieving user with ID:", id);
  client.query("SELECT * FROM bloguser WHERE id = $1", [id], (err, result) => {
    if (err) {
      // console.error("deserializeUser: Error while querying the database:", err);
      return done(err);
    }
    // console.log("deserializeUser: Retrieved user:", result.rows[0]);
    return done(null, result.rows[0]);
  });
});

module.exports = passport;
