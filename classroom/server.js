const express= require('express');
const app = express();
const router= express.Router();
const users= require("./routes/user.js");
const posts= require("./routes/post.js");
const session= require("express-session");
const flash = require('connect-flash');
const path=  require("path");
const { nextTick } = require('process');
// const cookieParser= require("cookie-parser");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(cookieParser("secretcode"));

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
});

const sessionoptions= {
        secret: "secretstring",
        resave: false,
        saveUninitialized: true
    };

app.use(session(sessionoptions));
app.use(flash());

app.use((req, res, next)=>{
    res.locals.successMsg= req.flash("success");
    res.locals.errorMsg= req.flash("error");
    next();
});

app.get("/register", (req, res)=>{
    let {name= "anonymous"}= req.query;
    req.session.name= name;

    if (name === "anonymous"){
        req.flash("error", "User not registered!");
    } else{
        req.flash("success", "User registered successfully!");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res)=>{
    res.render("page.ejs", {name: req.session.name });
});



// app.get("/reqcount",(req, res)=>{
//     if (req.session.count) {
//         req.session.count++;
//     } else{
//         req.session.count=1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });


app.get("/test", (req, res)=>{
    res.send("test successful!");
});




// app.get("/getSignedCookie", (req, res)=>{
//     res.cookie("madeIn", "India", {signed: true});
//     res.send("signed cookie sent");
// });

// app.get("/verify", (req, res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });


// app.get("/getcookies", (req, res)=>{
//     res.cookie("greet", "namaste");
//     res.cookie("madeIn", "India");
//     res.send("sent you some cookies");
// });

// app.get("/greet", (req, res)=>{
//     let {name= "anonymous"}= req.cookies;
//     res.send(`Hi, ${name}`);
// });


// app.get("/", (req, res)=>{
//     console.dir(req.cookies);
//     res.send("Hi, I'm root!");
// });

// app.use("/users", users);
// app.use("/posts", posts);








