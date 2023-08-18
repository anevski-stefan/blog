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

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
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

app.use("/blogs", checkAuthenticated, require("./routes/blogs.js"));
app.use("/categories", checkAuthenticated, require("./routes/categories.js"));

app.use("", require("./routes/user.js"));

app.get("", checkAuthenticated, (req, res) => {
  res.render("index");
});

// App listening on port
app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}`);
});
