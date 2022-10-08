const express = require('express');
const router = express.Router();
const catchAsyncEr = require("../utils/catchAsync");
const Campground = require("../models/campground");
const {campgroundSchema}  = require('../schema'); 
const ExpressError = require("../utils/ExpressError");



// to validate camp schema 
const validateCamp = (req, resp, next) => {
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

  
//get all camp
router.get(
    "/",
    catchAsyncEr(async (req, resp) => {
      const campground = await Campground.find({});
      resp.render("campground/index", { campground });
    })
  );
  
  // for the form
  router.get("/new", async (req, resp) => {
    resp.render("campground/new");
  });
  
  //to make new camp
  router.post(
    "/",validateCamp,
    catchAsyncEr(async (req, resp, next) => {
      
      //route err to next where err is handle
      const icamp = new Campground(req.body.campground); //acces the form elements
      await icamp.save();
      req.flash('success','Successfully made a new campground !');
      resp.redirect(`/campground/${icamp._id}`);
    })
  );
  
  //to show details of single camp
  router.get(
    "/:id",
    catchAsyncEr(async (req, resp) => {
      const { id } = req.params;
      const camp = await Campground.findById(id).populate('reviews');//to show with reviews
      if(!camp){
        req.flash('error','This Camp not exist...');
        resp.redirect('/campground');
      }
      // console.log(camp);
      resp.render("campground/show", { camp });
    })
  );
  
  //to edit camp form
  router.get(
    "/:id/edit",
    catchAsyncEr(async (req, resp) => {
      const { id } = req.params;
      const camp = await Campground.findById(id);
      resp.render("campground/edit", { camp });
    })
  );
  
  //update camp
  router.put(
    "/:id",validateCamp,
    catchAsyncEr(async (req, resp) => {
      const { id } = req.params;
      const camp = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
      });
      req.flash('success',"Successfullly updated Campground !!");
      resp.redirect(`/campground/${camp._id}`);
    })
  );
  
  //to delete single camp
  router.delete(
    "/:id",
    catchAsyncEr(async (req, resp) => {
      const { id } = req.params;
      await Campground.findByIdAndDelete(id);
      req.flash('success',"You Deleted the camp....");
      resp.redirect("/campground");
    })
  );
  


module.exports = router;