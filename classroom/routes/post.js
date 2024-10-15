const express= require('express');
const router= express.Router();

//Index Route- Posts
router.get("/", (req, res)=>{
    res.send("GET for posts");
});

//Show Route- Posts
router.get("/:id", (req, res)=>{
    res.send("GET for show posts");
});

//Post Route- Posts
router.post("/", (req, res)=>{
    res.send("POST for posts");
});

//Delete Route- Posts
router.delete("/:id", (req, res)=>{
    res.send("DELETE for posts");
});

module.exports= router;