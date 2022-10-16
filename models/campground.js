// model for database
const mongoose = require('mongoose');
const review = require('./review');
const Schema  = mongoose.Schema; //just reference

const CampgroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    //camp author/owner
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    // relationship with reviews one to many
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});


//find which method use on mongoose website 
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema); 