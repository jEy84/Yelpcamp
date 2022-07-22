// model for database
const mongoose = require('mongoose');
const Schema  = mongoose.Schema; //just reference

const CampgroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    // relationship with reviews one to many
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

module.exports = mongoose.model('Campground',CampgroundSchema); 