const express= require('express');
const router= express.Router();

//Index Route-  Users
router.get("/", (req, res)=>{
    res.send("GET for users");
});

//Show Route-  Users
router.get("/:id", (req, res)=>{
    res.send("GET for show users");
});

//Post Route- Users
router.post("/", (req, res)=>{
    res.send("POST for users");
});

//Delete Route- Users
router.delete("/:id", (req, res)=>{
    res.send("DELETE for users");
});

module.exports= router;