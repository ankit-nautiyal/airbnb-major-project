const Listing = require("../models/listing.js"); // Model renamed with uppercase L to avoid confusion
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing: listing });
};

module.exports.createListing = async (req, res, next) => {
    let response= await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location},${req.body.listing.country}`,
        limit: 1
    }).send();


    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry=  {
        type: "Point",
        coordinates: response.body.features[0].geometry.coordinates
    };

    savedListing= await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl= listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    console.log("Original Image URL:", originalImageUrl);
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let response = await geocodingClient
		.forwardGeocode({
			query: `${req.body.listing.location},${req.body.listing.country}`,
			limit: 1,
		})
		.send();
	let updateListing = req.body.listing;
	let listing = await Listing.findByIdAndUpdate(id, updateListing);

	listing.geometry = response.body.features[0].geometry;
	await listing.save();

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:");
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

//FILTER,FILTER BUTTON & SEARCH ROUTES:
module.exports.filter = async (req, res, next) => {
	let { id } = req.params;
	let allListing = await Listing.find({ category: { $all: [id] } });
	console.log(allListing);
	if (allListing.length != 0) {
		res.locals.success = `Listing(s) found by ${id}`;
		// req.flash("success", `Listing(s) found by ${id}`);
		res.render("listings/index.ejs", { allListing });
	} else {
		req.flash("error", "No listing found!");
		res.redirect("/listings");
	}
};

module.exports.filterbtn = (req, res, next) => {
	res.render("/views/includes/filterbtn.ejs");
};

module.exports.search = async (req, res) => {
	let input = req.query.q.trim().replace(/\s+/g, " "); // remove start, end and middle space remove, and add one space in the middle ------
	if (input == "" || input == " ") {
		//search value empty
		req.flash("error", "Search value empty!");
		res.redirect("/listings");
	}

	// convert every word 1st letter capital and others small---------------
	let data = input.split("");
	let element = "";
	let flag = false;
	for (let index = 0; index < data.length; index++) {
		if (index == 0 || flag) {
			element = element + data[index].toUpperCase();
		} else {
			element = element + data[index].toLowerCase();
		}
		flag = data[index] == " ";
	}

	let allListing = await Listing.find({
		title: { $regex: element, $options: "i" },
	});
	if (allListing.length != 0) {
		res.locals.success = "Listing searched by Title";
		// req.flash("success", "Listing searched by Title");
		res.render("listings/index.ejs", { allListing });
		return;
	}
	if (allListing.length == 0) {
		allListing = await Listing.find({
			category: { $regex: element, $options: "i" },
		}).sort({ _id: -1 });
		if (allListing.length != 0) {
			res.locals.success = "Listing(s) searched by Category";
			res.render("listings/index.ejs", { allListing });
			return;
		}
	}
	if (allListing.length == 0) {
		allListing = await Listing.find({
			country: { $regex: element, $options: "i" },
		}).sort({ _id: -1 });
		if (allListing.length != 0) {
			res.locals.success = "Listing(s) searched by Country";
			res.render("listings/index.ejs", { allListing });
			return;
		}
	}
	if (allListing.length == 0) {
		let allListing = await Listing.find({
			location: { $regex: element, $options: "i" },
		}).sort({ _id: -1 });
		if (allListing.length != 0) {
			res.locals.success = "Listings searched by Location";
			res.render("listings/index.ejs", { allListing });
			return;
		}
	}
	const intValue = parseInt(element, 10); // 10 for decimal return - int ya NaN
	const intDec = Number.isInteger(intValue); // check intValue is Number & Not Number return - true ya false

	if (allListing.length == 0 && intDec) {
		allListing = await Listing.find({ price: { $lte: element } }).sort({
			price: 1,
		});
		if (allListing.length != 0) {
			res.locals.success = `Listings searched for less than or equal to ₹ ${element}`;
			res.render("listings/index.ejs", { allListing });
			return;
		}
	}
	if (allListing.length == 0) {
		req.flash("error", "No listing found!");
		res.redirect("/listings");
	}
};
