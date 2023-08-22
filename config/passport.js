const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const client = require("../database/database.js");
const bcrypt = require("bcrypt");
passport.use(
  new LocalStrategy((username, password, done) => {
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
            return done(null, user);
          } else {
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
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  client.query("SELECT * FROM bloguser WHERE id = $1", [id], (err, result) => {
    if (err) {
      return done(err);
    }
    return done(null, result.rows[0]);
  });
});

module.exports = passport;
