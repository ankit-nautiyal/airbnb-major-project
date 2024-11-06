const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.profile = async (req, res) => {
	try {
		const allListing = await Listing.find({ owner: req.user._id }).populate("owner").sort({ _id: -1 });
		const allReview = await Review.find({ author: req.user._id });
		console.log(allReview);
		res.render("profiles/profile.ejs", { allListing, allReview });
	} catch (error) {
		req.flash("error", "Could not load profile data.");
		res.redirect("/");
	}
};

module.exports.allListingDestroy = async (req, res, next) => {
	let { id } = req.params;
	let deleteListing = await Listing.deleteMany({ owner: id });
	req.flash("error", `${deleteListing.deletedCount} Listing(s)  Deleted!`);
	res.redirect("/profile");
};

module.exports.profileDestroyListing = async (req, res, next) => {
	try {
		let { id } = req.params;
		let deleteListing = await Listing.findByIdAndDelete(id);
		console.log(deleteListing);
		req.flash("error", "Listing Deleted!");
		console.log("deleted a listing");
		res.redirect("/profile");
	} catch (error) {
		req.flash("error", `Some error occured!`);
		res.redirect("/profile");
	}
	
};

module.exports.allReviewDestroy = async (req, res) => {
    try {
        const { id } = req.params;

        // Find all reviews by the author
        const allReview = await Review.find({ author: id });
        const reviewIds = allReview.map(review => review._id);

        // Pull reviews from listings in one go
        await Listing.updateMany(
            { reviews: { $in: reviewIds } },
            { $pull: { reviews: { $in: reviewIds } } }
        );

        // Delete all reviews by the author in one go
        await Review.deleteMany({ _id: { $in: reviewIds } });

        req.flash("success", `${reviewIds.length} reviews deleted successfully!`);
        res.redirect("/profile");
    } catch (error) {
        req.flash("error", "Failed to delete reviews.");
        res.redirect("/profile");
    }
};

module.exports.profileDestroyReview = async (req, res, next) => {
	let { id, reviewId } = req.params;
	await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash("error", "Review Deleted!");
	res.redirect("/profile");
};

