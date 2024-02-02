const express=require("express");
const router= express.Router({mergeParams:true});
const Review=require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController=require("../controllers/reviews.js")

//REVIEW ROUTE
router.post("/" ,isLoggedIn,validateReview ,wrapAsync(reviewController.reviewRoute));

//DELETE REVIEW ROUTE
router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor, wrapAsync(reviewController.delReviewRoute));

module.exports=router;