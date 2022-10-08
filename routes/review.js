const express = require('express');
const router = express.Router({mergeParams:true}); //for id 

const Review = require('../models/review');
const catchAsyncEr = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { reviewSchema } = require('../schema');

// validate review
const validateReview = (req, resp, next) => {
    const { error } = reviewSchema.validate(req.body);
  
    if (error) {
      const msg = error.details.map(ele => ele.message).join(",");
      console.log(msg);
      throw new ExpressError(msg, 400);
    } else {
      next()
    }
  
  }


// for user reviews
router.post('/', validateReview, catchAsyncEr(async (req, resp) => {
    const campground = await Campground.findById(req.params.id);
  
    const review = new Review(req.body.review);
  
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success',"Your review Is created ...")
    resp.redirect(`/campground/${campground._id}`)
  }))
  
  
  //for deleting the reviews
  router.delete('/:reviewId', catchAsyncEr(async (req, resp) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    resp.redirect(`/campground/${id}`);
  }))


  module.exports = router;