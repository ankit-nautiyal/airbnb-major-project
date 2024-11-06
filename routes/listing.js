const express= require('express');
const router= express.Router();
const wrapAsync= require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner, validateListing}= require('../middleware.js');
const listingController= require("../controllers/listing.js");
const multer  = require('multer')
const {storage}= require('../cloudConfig.js');
const upload = multer({ storage });


//INDEX & CREATE LISTING ROUTE:
router.route("/")
    .get(wrapAsync (listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync( listingController.createListing));


//NEW LISTING ROUTE:
router.get("/new", isLoggedIn, listingController.renderNewForm);


//SEARCH ROUTE:
router.get("/search", wrapAsync(listingController.search));

//SHOW, UPDATE & DELETE LISTING ROUTE:
router.route("/:id")
    .get( wrapAsync ( listingController.showListing))
    .put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing,  wrapAsync ( listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync (listingController.destroyListing));



//EDIT LISTING ROUTE:
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync ( listingController.renderEditForm));


//FILTER ROUTE:
router.get("/filter/:id", wrapAsync(listingController.filter));                              //Filter Route-----------------

//FILTER BUTTON ROUTE: 
router.get("/filterbtn",listingController.filterbtn);                                       //FilterButton Route-----------------



module.exports= router;