const express= require('express');
const router= express.Router();
const wrapAsync= require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner, validateListing}= require('../middleware.js');
const listingController= require("../controllers/listing.js");


//INDEX & CREATE LISTING ROUTE:
router.route("/")
    .get(wrapAsync (listingController.index))
    .post(isLoggedIn, validateListing, wrapAsync( listingController.createListing));

//NEW LISTING ROUTE:
router.get("/new", isLoggedIn, listingController.renderNewForm);

//SHOW, UPDATE & DELETE LISTING ROUTE:
router.route("/:id")
    .get( wrapAsync ( listingController.showListing))
    .put( isLoggedIn, isOwner, validateListing,  wrapAsync ( listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync (listingController.destroyListing));


//EDIT LISTING ROUTE:
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync ( listingController.renderEditForm));


module.exports= router;