const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const passport = require("./config/passport.js");
const session = require("express-session");
const { checkAuthenticated } = require("./config/middleware.js");

// Express session
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    name: "userCookie",
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// Passport js
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "./layouts/base");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  if (!res.locals.logsPrinted) {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user;
    res.locals.userName = req.user ? req.user.name : null;

    res.locals.logsPrinted = true;
  }

  next();
});

// Routes
app.use(require("./routes/blog.js"));
app.use("", require("./routes/user.js"));
app.use(require("./routes/home.js", checkAuthenticated));

// App listening on port
app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}`);
});
