// import 
const express  = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
});

const db = mongoose.connection; //just reference

db.on('error',console.error.bind(console,"Connection Error: "));
db.once('open',()=>{
    console.log("Database Connected: ");
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.get('/',(req,resp)=>{
    resp.render('home');
})

app.get('/campground',async(req,resp)=>{
    const campground = await Campground.find({});
    resp.render('campground/index',{campground});
})


// for the form 
app.get('/campground/new',async(req,resp)=>{
    resp.render('campground/new');
})
app.post('/campground',async(req,resp)=>{
    const icamp = new Campground(req.body.campground); //acces the form elements
    await icamp.save();
    resp.redirect(`/campground/${icamp._id}`);
})

app.get('/campground/:id',async(req,resp)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    resp.render('campground/show',{camp});
})

app.listen(9090,()=>{
    console.log('Listning on port 9090');
})


// app.get('/movies/:id',async (req,resp)=>{
//     const {id} = req.params;
//     const movie = await MovieDetail.findById(id); //found one movie by id  
//     resp.render('movies/movie',{movie});
// })