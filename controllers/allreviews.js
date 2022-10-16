const Review = require('../models/review');
const Campground = require("../models/campground");


module.exports.createReviews = async (req, resp) => {
    const campground = await Campground.findById(req.params.id);
  
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success',"Your review Is created ...")
    resp.redirect(`/campground/${campground._id}`)
  }

module.exports.deleteReviews = async (req, resp) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    resp.redirect(`/campground/${id}`);
  }