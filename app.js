// import 
const express  = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/yelp-camp',{
});

const db = mongoose.connection; //just reference

db.on('error',console.error.bind(console,"Connection Error: "));
db.once('open',()=>{
    console.log("Database Connected: ");
});

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(morgan('dev'));//middleware
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))


// app.use('/',(reqm,resp)=>{
//     resp.send('Every single request')
// })


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


app.get('/campground/:id/edit',async(req,resp)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    resp.render('campground/edit',{camp});
})


app.put('/campground/:id',async(req,resp)=>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    resp.redirect(`/campground/${camp._id}`);


})

app.delete('/campground/:id',async(req,resp)=>{
    const {id}= req.params;
    await Campground.findByIdAndDelete(id);
    resp.redirect('/campground')
})

app.listen(9090,()=>{
    console.log('Listning on port 9090');
})


// app.get('/movies/:id',async (req,resp)=>{
//     const {id} = req.params;
//     const movie = await MovieDetail.findById(id); //found one movie by id  
//     resp.render('movies/movie',{movie});
// })