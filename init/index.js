const mongoose= require('mongoose');
const initData= require("./data.js");
const Listing = require('../models/listing.js');

const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(()=>{
        console.log("connection successful")
    })
    .catch((err) =>{
        console.log(err)
    });

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data= initData.data.map((obj) => ({...obj, owner: '6704e818222eb654276369cd'}));
        await Listing.insertMany(initData.data);
        console.log("Database initialized with sample data");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
};
initDB();