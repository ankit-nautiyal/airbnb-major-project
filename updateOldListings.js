// This code file can be used to add coordiantes to listings by forward geocoding to the lcoations already there in init folder-->data.js file,
//whenever we need to re-initiate all the old lisitngs already existing in the data.js file

require('dotenv').config();
const mongoose = require('mongoose');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const Listing = require('./models/listing'); 

const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

console.log('Mapbox Token:', process.env.MAPBOX_ACCESS_TOKEN);


// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

async function updateOldListings() {
  try {
    // Find listings with missing geometry
    const oldListings = await Listing.find({
      'geometry.type': { $exists: false }
    });

    console.log(`Found ${oldListings.length} old listings without coordinates.`);

    for (let listing of oldListings) {
      // Apply forward geocoding to get coordinates
      const response = await geocodingClient
        .forwardGeocode({
          query: listing.location, // assuming listing.location contains the address
          limit: 1
        })
        .send();

      const coordinates = response.body.features[0].geometry.coordinates;

      // Update the listing with geometry data
      listing.geometry = {
        type: 'Point',
        coordinates: coordinates
      };

      await listing.save();
      console.log(`Updated listing: ${listing.title} with coordinates: ${coordinates}`);
    }

    console.log('All old listings updated successfully.');

  } catch (err) {
    console.error('Error updating listings:', err);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
updateOldListings();
