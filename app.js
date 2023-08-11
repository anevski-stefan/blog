const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const blogsRoute = require("./routes/add.js");
const addBlogFormRoute = require("./routes/add-blog-form.js");
const add = require("./routes/add.js");
const remove = require("./routes/remove.js");

app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "./layouts/base");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes

app.use(remove);

app.use("/blogs/:blogId/add", add);

app.use("/blogs/add-form", addBlogFormRoute);

app.use("/blogs", blogsRoute);

app.get("", (req, res) => {
  res.render("index");
});

// App listening on port
app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}`);
});
