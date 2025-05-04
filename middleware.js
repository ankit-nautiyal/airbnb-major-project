const Listing= require("./models/listing");
const Review= require("./models/review.js");
const User = require("./models/user.js");
const {listingSchema, reviewSchema, userSchema} = require("./schema.js");
const ExpressError= require('./utils/ExpressError.js');

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

//TO VALIDATE USER
module.exports.validateUser = (req, res, next) => {
	let { error } = userSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		console.log(error);
		console.log(errMsg);
		req.flash("error", `${errMsg}`);
		if (!req.user) {
			return res.redirect("/signup");
		} else {
			return res.redirect(`/update-form/${req.user._id}`)
		}
	} else {
		next();
	}
};



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

//isOwnerAll----------
module.exports.isOwnerAll = async (req, res, next) => {
	try {
		let { id } = req.params;
		console.log(id);
		let listing = await Listing.findOne({ owner: id });
		console.log(listing);
		if (!listing) {
			req.flash("error", "You don't have any listings");
			return res.redirect(`/profile`);
		}
		if (!listing.owner.equals(res.locals.currUser._id)) {
			req.flash("error", "You are not the owner of this listing");
			return res.redirect(`/listings`);
		}
		next();
	} catch (err) {
		next(new ExpressError(400, "This Listing Page is not valid"));
	}
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

//--------isReviewAuthorProfile----------
module.exports.isReviewAuthorProfile = async (req, res, next) => {
	try {
		let { id, reviewId } = req.params;
		let review = await Review.findById(reviewId);
		if (!review.author.equals(res.locals.currUser._id)) {
			req.flash("error", "You are not the author of this review");
			return req.get('referer');
		}
		next();
	} catch {
		next(new ExpressError(400, "This Review Page is not valid"));
	}
};



//----------isReviewAll-----------
module.exports.isReviewAll = async (req, res, next) => {
	try {
		let { id } = req.params;
		let review = await Review.findOne({ author: id });
		if (!review) {
			req.flash("error", "You don't have any reviews...");
			return res.redirect(`/profile`);
		}
		if (!review.author.equals(res.locals.currUser._id)) {
			req.flash("error", "You are not the author of this review");
			return res.redirect(`/listings`);
		}
		next();
	} catch {
		next(new ExpressError(400, "This Review Page is not valid"));
	}
};


//TO VERIFY PROFILE OWNER--------
module.exports.isProfileOwner = async (req, res, next) => {
	try {
		let { id } = req.params;
		let user = await User.findById(id);
		if (!user._id.equals(res.locals.currUser._id)) {
			req.flash("error", "You are not the profile owner.");
			return res.redirect(`/listings/${id}`);
		}
		next();
	} catch (err) {
		next(new ExpressError(400, "This Profile Page is not valid"));
	}
};

//TO VERIFY FOR DUPLICATE EMAIL
module.exports.verifyEmail = async (req, res, next) => {
	let existingUser = await User.find({ email: `${req.body.email}` });
	if (existingUser.length == 0) {
		return next();
	}
	req.flash("error", "Account with that email address already exists.");
	if (!req.user) {
		return res.redirect("/signup");
	} else {
		return res.redirect(`/update-form/${req.user._id}`)
	}
};

module.exports.verifyUserEmail = async (req, res, next) => {
	let existingUser = await User.find({ email: `${req.body.email}` });
	if (existingUser.length == 0) {
		return next();
	}
	if (existingUser.length <= 1) {
		if (existingUser[0].email == req.user.email) {
			return next();
		}
	}
	req.flash("error", "Account with that email address already exists.");
	if (!req.user) {
		return res.redirect("/signup");
	} else {
		return res.redirect(`/update-form/${req.user._id}`)
	}
};