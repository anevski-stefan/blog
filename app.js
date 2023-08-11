const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const dbClient = require("./database/database.js");
const blogsRoute = require("./routes/blogs.js");

app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "./layouts/base");
app.set("view engine", "ejs");

// POSTGRESQL SETUP

// Routes

app.use("/blogs", blogsRoute);

app.get("", (req, res) => {
  res.render("index");
});

// App listening on port
app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}`);
});
