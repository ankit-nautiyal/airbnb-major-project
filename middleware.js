const Listing= require("./models/listing");
const Review= require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError= require('./utils/ExpressError.js');

//MIDDLEWARE FOR HANDLING SERVER-SIDE VALIDATION OF REVIEWS USING JOI:
module.exports.validateReview= (req, res, next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

//MIDDLEWARE FOR HANDLING SERVER-SIDE VALIDATION OF LISTINGS USING JOI:
module.exports.validateListing= (req, res, next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

//MIDDLEWARE TO CHECK WHETHER THE USER IS LOGGED IN OR NOT BEFORE CREATING/EDITING/DELETING A LISTING
module.exports.isLoggedIn= (req, res, next) =>{
    if(!req.isAuthenticated()) {
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

//MIDDLEWARE TO REDIRECT USER ON THE SAME PAGE AFTER LOGGING IN WHERE HE WAS
module.exports.saveRedirectUrl= (req, res, next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
};

//MIDDLEWARE TO CHECK WHETHER THE USER IS THE OWNER OF THE LISTING BEFORE CREATING/EDITING/DELETING IT
module.exports.isOwner= async (req, res, next) =>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//MIDDLEWARE TO CHECK WHETHER THE USER IS AUTHOR OF THE REVIEW BEFORE DELETING IT
module.exports.isReviewAuthor= async (req, res, next) =>{
    let {id, reviewId}= req.params;
    let review= await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};