const {campgroundSchema,reviewSchema}  = require('./schema'); 
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review")


module.exports.isLoggedIn = (req,resp,next)=>{
    if(!req.isAuthenticated()){
         req.session.returnTo =  req.original;
        req.flash('error','You need to First Login');
        return resp.redirect('/login');
      }
      next();
}

// to validate camp schema 
module.exports.validateCamp = (req, resp, next) => {
  // if camp body empty
  // if(!req.body.campground) throw new ExpressError('Invalid campground data',400);
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    //error to validate schema
    //object in object thats why
    console.log(error);
    const msg = error.details.map((ele) => ele.message).join(",");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next()
  }
  console.log(error);
}

//to check if user own the post or not 
module.exports.isAuthor = async(req,resp,next)=>{
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if(!camp.author.equals(req.user._id)){
    req.flash('error','You do not have persmission to Update ');
    return resp.redirect(`/campground/${id}`);
  }
  next();
}


module.exports.isReviewAuthor = async(req,resp,next)=>{
  const {id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)){
    req.flash('error','You do not have persmission to Update ');
    return resp.redirect(`/campground/${id}`);
  }
  next();
}


// validate review
module.exports.validateReview = (req, resp, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(ele => ele.message).join(",");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next()
  }

}