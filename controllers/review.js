const Review= require("../models/review.js");
const Listing= require("../models/listing.js");


module.exports.createReview=async (req, res)=>{
    // let listing= await Listing.findById(req.params.id);
    // let newReview= new Review(req.body.review);
    // newReview.author= req.user._id;
    // listing.reviews.push(newReview);

    // await newReview.save();
    // await listing.save();
    // req.flash("success", "New Review Created!");
    // res.redirect(`/listings/${listing._id}`);
    

    // all done 
    // 1st review me listing ka id show nhi ho rha tha to id hi nhi to delete kaise hoga issi liye review create krte time hum
    // id bhi add krenge or usse populate kar ke send krenge ok 

    //tq so muxh! got it....1-2 small isuee or dkeh loge if possible?

	let listing = await Listing.findById(req.params.id);
	let newReview = new Review(req.body.review);
	newReview.author = req.user._id;
	newReview.listing = listing._id;//add listing id in review
	listing.reviews.push(newReview);
	await newReview.save();
	await listing.save();
	console.log("new review saved");
	req.flash("success", "New Review Created!");
	res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview= async (req, res)=>{
    let {id, reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};
