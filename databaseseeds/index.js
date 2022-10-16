// used to create random dataBase and add to MOngoDB

const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const cities = require('./cities.js');
const { places, descriptors } = require('./seedHelped.js');
const axios = require('axios'); //API pal

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
      const price = Math.floor(Math.random() * 20) + 10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
          author:'6341ff49be775a7bf5570a24',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await getimages(),
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})


// getting image from the unsplash source
async function getimages() {
    try {
      const response = await axios.get('https://api.unsplash.com/photos/random',{
        params:{
            client_id:"OL1x8N07y77flhztN-wPcmvKhw0VZSJaiW6vpeRV6ms", //don't use mine
            collections:"483251"
        }
      });
      return response.data.urls.regular;
    } catch (error) {
      console.error("No getting imges 😒😒😒",error);
    }
  }
