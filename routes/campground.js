const express = require('express');
const router = express.Router();
const catchAsyncEr = require("../utils/catchAsync");

const { isLoggedIn, isAuthor, validateCamp } = require('../middleware');
//controllers
const { index, renderNewForm, createNewCamp, showOneCamp, editOneCampForm, updatingCamp, deleteCamp } = require('../controllers/allcampground');


//more structred way 
// router.route  ....remain 


//get all camp
router.get(
  "/",
  catchAsyncEr(index)
);

// for the form
router.get("/new", isLoggedIn, renderNewForm);

//to make new camp
router.post(
  "/", validateCamp,
  catchAsyncEr(createNewCamp)
);

//to show details of single camp
router.get(
  "/:id",
  catchAsyncEr(showOneCamp)
);

//to edit camp form
router.get(
  "/:id/edit", isLoggedIn, isAuthor,
  catchAsyncEr(editOneCampForm)
);

//update camp
router.put(
  "/:id", validateCamp, isLoggedIn, isAuthor,
  catchAsyncEr(updatingCamp)
);

//to delete single camp
router.delete(
  "/:id", isLoggedIn, isAuthor,
  catchAsyncEr(deleteCamp)
);



module.exports = router;