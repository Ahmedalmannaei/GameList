const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const morgan = require("morgan");
app.use(express.urlencoded({ extended: true }));
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // saves files to /uploads
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use("/uploads", express.static("uploads"));

const port = process.env.PORT ? process.env.PORT : "3000";
mongoose.connect(process.env.MONGODB_URI);
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

const authController = require("./controllers/auth");
const reviewsController = require("./controllers/reviews");

app.use("/auth", authController);
app.use("/reviews", reviewsController);
app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});
