const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const cities = require('./cities.js');
const { places, descriptors } = require('./seedHelped.js');



mongoose.connect('mongodb://localhost:27017/yelp-camp',{
});

const db = mongoose.connection; //just reference

db.on('error',console.error.bind(console,"Connection Error: "));
db.once('open',()=>{
    console.log("Database Connected: ");
});


const sample  = array  => array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})