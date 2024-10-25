if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

// console.log(process.env.CLOUD_API_SECRET);

const express= require('express');
const app = express();
const mongoose= require('mongoose');
const path= require("path");
const ejsMate= require("ejs-mate");
const ExpressError= require('./utils/ExpressError.js');
const methodOverride= require("method-override");
const session= require("express-session");
const passport= require("passport");
const flash = require('connect-flash');
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");
const MongoStore = require('connect-mongo');

const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(()=>{
        console.log("connection successful")
    })
    .catch((err) =>{
        console.log(err)
    });


async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOptions= {
    secret: "secretecode",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        touchAfter: 24 * 3600 // time period in seconds
    }),
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

// app.get("/demouser", async (req, res) => {
//     let fakeUser= new User({
//         email: "student3@gmail.com",
//         username: "delta-student3",
//     });

//     let registeredUser= await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//LISTEN PORT:
app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});

//ROOT ROUTE:
// app.get("/", (req, res)=>{
//     res.send("root is working- wanderlust");
// });


//TO HANDLE ERROR FOR ALL PAGES THAT DON'T EXIST ON THE SERVER/WEBSITE
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!"));
});

// ERROR HANDLING MIDDLEWARE:
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"}= err;
    res.status(statusCode).render("error.ejs", {err});
    // res.send("Something went wrong");
})
