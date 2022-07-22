const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(), //you can use regX here
    price: Joi.number().required().min(0).max(500),
    location: Joi.string().required().min(0).max(100),
    image: Joi.string().required(),
    description: Joi.string().required().min(0).max(1000),
  }).required(),
});
