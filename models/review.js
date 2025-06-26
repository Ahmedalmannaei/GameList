const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  comments: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
