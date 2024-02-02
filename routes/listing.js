const express=require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//controller
const listingController = require("../controllers/listing.js")
                        
                        
router
    .route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(                                   //create route
        isLoggedIn,
        
        upload.single("listing[image]"),
        validateListing, wrapAsync(listingController.createRoute)
        );
        
                     
//NEW ROUTE
router.get("/new", isLoggedIn,listingController.renderNewForm);

// In your router
router.get('/search', wrapAsync(listingController.searchRoute));



router
    .route("/:id")
//SHOW ROUTE
.get(wrapAsync(listingController.showRoute))

//UPDATE ROUTE
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateRoute))

//DELETE ROUTE
.delete( isLoggedIn,isOwner,wrapAsync(listingController.deleteRoute));





//EDIT ROUTE
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.editRoute));



module.exports=router;