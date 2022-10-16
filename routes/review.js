const express = require('express');
const router = express.Router({mergeParams:true}); //for id 
const catchAsyncEr = require("../utils/catchAsync");

const {validateReview,isLoggedIn, isReviewAuthor} = require('../middleware');
//controllers
const { createReviews, deleteReviews } = require('../controllers/allreviews');




// for user reviews
router.post('/', isLoggedIn,validateReview, catchAsyncEr(createReviews))
  
  
  //for deleting the reviews
  router.delete('/:reviewId',isLoggedIn,isReviewAuthor ,catchAsyncEr(deleteReviews))


  module.exports = router;