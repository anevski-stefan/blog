const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const passport = require("./config/passport.js");
const session = require("express-session");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./config/middleware.js");
const client = require("./database/database.js");

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
app.use(require("./routes/search.js"));
app.use(
  "/blogs/add-form",
  checkAuthenticated,
  require("./routes/add-blog-form.js")
);
app.use(require("./routes/edit-blog-form.js"));
app.use(require("./routes/detail-blog-view.js"));
app.use(require("./routes/add.js"));
app.use(require("./routes/edit.js"));
app.use(require("./routes/remove.js"));
app.use(require("./routes/like-dislike.js"));
app.use("/blogs", checkAuthenticated, require("./routes/blogs.js"));

app.use("/categories", checkAuthenticated, require("./routes/categories.js"));

app.use("", require("./routes/user.js"));

app.use(require("./routes/home.js", checkAuthenticated));

app.use((req, res, next) => {
  if (req.user) {
    const user_id = req.user.id;
    const query = `SELECT * FROM bloguser WHERE id = ${user_id}`;
    client.query(query, (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      const user = result.rows[0];
    });
  }
  next(); // Add this line
});

// App listening on port
app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}`);
});
