const Joi = require('joi');

module.exports.listingSchema= Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        category: Joi.alternatives().try(
            Joi.array().items(Joi.string()).min(1), // For multiple categories
            Joi.string()                            // For a single category
        )
    }).required()
});

module.exports.reviewSchema= Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

module.exports.userSchema = Joi.object({
    fName: Joi.string().required().trim(),
    lName: Joi.string().allow("",null),
    username: Joi.string().required(),
	email: Joi.string().required().email(),
    password: Joi.string().min(8),
});

