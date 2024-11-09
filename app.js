if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express= require('express');
const app = express();
const mongoose= require('mongoose');
const path= require("path");
const ejsMate= require("ejs-mate");
const ExpressError= require('./utils/ExpressError.js');
const methodOverride= require("method-override");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const passport= require("passport");
const flash = require('connect-flash');
const LocalStrategy= require("passport-local");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User= require("./models/user.js");


const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const profileRouter = require("./routes/profile.js");
const googleRoute = require("./routes/google.js");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


const dbUrl= process.env.ATLASDB_URL;

main()
    .then(()=>{
        console.log("connection successful")
    })
    .catch((err) =>{
        console.log(err)
    });


async function main() {
    await mongoose.connect(dbUrl);
}

const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600 // time period in seconds, here 24hours taken
});

store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions= {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/profile", profileRouter);
app.use("/auth/google", googleRoute);

//LISTEN PORT:
app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});

//TO HANDLE ERROR FOR ALL PAGES THAT DON'T EXIST ON THE SERVER/WEBSITE
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!"));
});

// ERROR HANDLING MIDDLEWARE:
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"}= err;
    res.status(statusCode).render("listings/error.ejs", {message});
})


