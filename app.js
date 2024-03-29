// import
const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
//router
const campgroundsRoutes = require('./routes/campground');
const reviewsRoutes = require('./routes/review');
const userRoutes = require('./routes/userauth');

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
app.use(express.static(path.join(__dirname,'public')))

//just for development
const sessionConfig  ={
  secret:"thisisfromthedevelopmentpreouse",
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly:true,
    expires: Date.now() +1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//store information from sesstion and retriew
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next) =>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})
//  app.use('/',(reqm,resp)=>{
//      resp.send('Every single request')
//  })

// router 
app.use('/campground',campgroundsRoutes);
app.use('/campground/:id/reviews',reviewsRoutes);
app.use('/',userRoutes);

app.get("/", (req, resp) => {
  resp.render("home");
});


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
1