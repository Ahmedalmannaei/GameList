const router = require("express").Router();
const Review = require("../models/review");
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "..", "uploads") });

router.get("/", async (req, res) => {
  if (!req.session.userId) return res.redirect("/auth/sign-in");
  const reviews = await Review.find({ owner: req.session.userId }).populate(
    "owner"
  );
  res.render("reviews/index.ejs", { reviews });
});
router.get("/new", async (req, res) => {
  if (!req.session.userId) return res.redirect("/auth/sign-in");
  res.render("reviews/new.ejs");
});
router.post("/", upload.single("image"), async (req, res) => {
  req.body.owner = req.session.userId;
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  await Review.create(req.body);
  res.redirect("/reviews");
});
router.get("/all", async (req, res) => {
  if (!req.session.userId) return res.redirect("/auth/sign-in");
  const reviews = await Review.find().populate("owner");
  res.render("reviews/all-reviews.ejs", { reviews });
});

router.get("/:reviewId", async (req, res) => {
  if (!req.session.userId) return res.redirect("/auth/sign-in");
  const review = await Review.findById(req.params.reviewId).populate("owner");

  res.render("reviews/show.ejs", { review, user: { _id: req.session.userId } });
});
router.get("/:reviewId/edit", async (req, res) => {
  const currentReview = await Review.findById(req.params.reviewId);
  res.render("reviews/edit.ejs", { review: currentReview });
});
router.put("/:reviewId", upload.single("image"), async (req, res) => {
  const currentReview = await Review.findById(req.params.reviewId);
  if (!req.file) {
    return res
      .status(400)
      .send("Error: Image is required when editing the review.");
  }
  if (currentReview.owner.equals(req.session.userId)) {
    await currentReview.updateOne({
      name: req.body.gameName,
      rating: req.body.rating,
      comments: req.body.comments,
      image: `/uploads/${req.file.filename}`,
    });
    res.redirect(`/reviews/${req.params.reviewId}`);
  } else {
    res.redirect("/");
  }
});
router.delete("/:reviewId", async (req, res) => {
  const currentReview = await Review.findById(req.params.reviewId);
  if (currentReview.owner.equals(req.session.userId)) {
    await currentReview.deleteOne();
    res.redirect("/reviews");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
