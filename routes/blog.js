const express = require("express");
const router = express.Router();
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../config/middleware.js");

router.use(require("../routes/search.js"));
router.use(
  "/blogs/add-form",
  checkAuthenticated,
  require("../routes/add-blog-form.js")
);
router.use(require("../routes/edit-blog-form.js"));
router.use(require("../routes/detail-blog-view.js"));
router.use(require("../routes/edit.js"));
router.use(require("../routes/remove.js"));
router.use(require("../routes/like-dislike.js"));
router.use(require("../routes/add.js"));
router.use("/blogs", checkAuthenticated, require("../routes/blogs.js"));
router.use("", require("../routes/user.js"));
router.use(
  "/categories",
  checkAuthenticated,
  require("../routes/categories.js")
);

module.exports = router;
