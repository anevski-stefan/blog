module.exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports.checkNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

module.exports.checkAdmin = (req, res, next) => {
  console.log(req.user.username);
  if (req.user.username == "admin") {
    return next();
  }
  res.redirect("/");
};
