// require('dotenv').config();

// const mongoose= require('mongoose');
// const initData= require("./data.js");
// const Listing = require('../models/listing.js');
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken= process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

// main()
//     .then(()=>{
//         console.log("connection successful")
//     })
//     .catch((err) =>{
//         console.log(err)
//     });

// async function initDB() {
//     try {
//         // Delete all existing listings if you need a fresh start
//         await Listing.deleteMany({});
//         console.log('Old listings deleted.');
    
//         for (let data of initData.data) {
//         // Use geocoding to get coordinates based on the location field
//         const response = await geocodingClient
//             .forwardGeocode({
//             query: data.location, // Make sure data.location contains an address
//             limit: 1
//             })
//             .send();
    
//         const coordinates = response.body.features[0].geometry.coordinates;
    
//         // Populate the geometry field with the coordinates
//         data.geometry = {
//             type: 'Point',
//             coordinates: coordinates
//         };
    
//         // Create a new listing document and save it to the database
//         const newListing = new Listing(data);
//         await newListing.save();
//         console.log(`Listing saved: ${newListing.title}`);
//         }
    
//         console.log('All listings have been initialized successfully.');
    
//     } catch (err) {
//         console.error('Error initializing data:', err);
//     } finally {
//         mongoose.connection.close();
//     }
// }
    
// // Run the initialization function
// initDB();



if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
	.then(() => {
		console.log("connected to DB");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect(MONGO_URL);
}

let categoryAll = [
	"Beachfront",
	"Cabins",
	"OMG!",
	"Lake",
	"Design",
	"Amazing Pools",
	"Farms",
	"Amazing Views",
	"Rooms",
	"Lakefront",
	"Tiny Homes",
	"Countryside",
	"Treehouse",
	"Trending",
	"Tropical",
	"National Parks",
	"Casties",
	"Camping",
	"Top Of The World",
	"Luxe",
	"Iconic Cities",
	"Earth Homes",
];

const initDB = async () => {
	await Listing.deleteMany({});
	initData.data = initData.data.map((obj) => ({
		...obj,
		owner: "672243c2f8fb4e516fa2cfff",
		price: obj.price * 25,
		category: [
			`${categoryAll[Math.floor(Math.random() * 22)]}`,
			`${categoryAll[Math.floor(Math.random() * 22)]}`,
		],
	}));
	await Listing.insertMany(initData.data);
	console.log("sample data was initialized successfully!");
};
initDB();