const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
router.get("/sign-up", async (req, res) => {
  res.render("auth/sign-up.ejs");
});
router.post("/sign-up", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send("Username already taken.");
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and Confirm Password must match");
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;
  const user = await User.create(req.body);

  res.send(`Your account is ready to use ${user.username}`);
});

router.get("/sign-in", async (req, res) => {
  res.render("auth/sign-in.ejs");
});
router.post("/sign-in", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });

  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }

  const passwordMatches = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );

  if (!passwordMatches) {
    return res.send("Login failed. Please try again.");
  }

  req.session.userId = userInDatabase._id;
  res.redirect("/"); // ✅ now response is sent
});
router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
