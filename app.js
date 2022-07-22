// import
const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const catchAsyncEr = require("./utils/catchAsync");
// const Joi = require('joi');
const {campgroundSchema} = require('./schema');
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const Review  = require('./models/review');
const methodOverride = require("method-override");

//for mongoose connection
mongoose.connect("mongodb://localhost:27017/yelp-camp", {});

const db = mongoose.connection; //just reference

db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", () => {
  console.log("Database Connected: ");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("dev")); //middleware
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.use('/',(reqm,resp)=>{
//     resp.send('Every single request')
// })


// to validate camp schema 
const validateCamp = (req,resp,next)=>{
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
    }else{
      next()
    }
    console.log(error);
}


app.get("/", (req, resp) => {
  resp.render("home");
});

//get all camp
app.get(
  "/campground",
  catchAsyncEr(async (req, resp) => {
    const campground = await Campground.find({});
    resp.render("campground/index", { campground });
  })
);

// for the form
app.get("/campground/new", async (req, resp) => {
  resp.render("campground/new");
});

//to make new camp
app.post(
  "/campground",validateCamp,
  catchAsyncEr(async (req, resp, next) => {
    
    //route err to next where err is handle
    const icamp = new Campground(req.body.campground); //acces the form elements
    await icamp.save();
    resp.redirect(`/campground/${icamp._id}`);
  })
);

//to show details of single camp
app.get(
  "/campground/:id",
  catchAsyncEr(async (req, resp) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    resp.render("campground/show", { camp });
  })
);

//to edit camp form
app.get(
  "/campground/:id/edit",
  catchAsyncEr(async (req, resp) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    resp.render("campground/edit", { camp });
  })
);

//update camp
app.put(
  "/campground/:id",validateCamp,
  catchAsyncEr(async (req, resp) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    resp.redirect(`/campground/${camp._id}`);
  })
);

//to delete single camp
app.delete(
  "/campground/:id",
  catchAsyncEr(async (req, resp) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    resp.redirect("/campground");
  })
);

// for user reviews
app.post('/campground/:id/reviews',catchAsyncEr(async(req,resp)=>{
  const campground = await Campground.findById(req.params.id);

  const review = new Review(req.body.review);

  campground.reviews.push(review);
  await review.save();
  await campground.save();
  resp.redirect(`/campground/${campground._id}`)
}))




app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!😕😕😕";
  res.status(statusCode).render("error", { err, statusCode });
});

app.listen(9090, () => {
  console.log("Listning on port 9090");
});
