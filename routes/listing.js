const express= require('express');
const router= express.Router();
const wrapAsync= require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner, validateListing}= require('../middleware.js');
const listingController= require("../controllers/listing.js");


//INDEX ROUTE:
router.get("/", wrapAsync (listingController.index));

//NEW LISTING ROUTE:
router.get("/new", isLoggedIn, listingController.renderNewForm);

//SHOW LISTING ROUTE:
router.get("/:id", wrapAsync ( listingController.showListing));

//CREATE LISTING ROUTE:
router.post("/", isLoggedIn, validateListing, wrapAsync( listingController.createListing));

//EDIT LISTING ROUTE:
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync ( listingController.renderEditForm));

//UPDATE LISTING ROUTE:
router.put("/:id", isLoggedIn, isOwner, validateListing,  wrapAsync ( listingController.updateListing));

//DELETE LISTING ROUTE:
router.delete("/:id", isLoggedIn, isOwner, wrapAsync (listingController.destroyListing));

module.exports= router;