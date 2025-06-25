const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

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
