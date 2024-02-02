const Listing=require("../models/listing.js");
const geoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = geoCoding({accessToken : mapToken});

///index route
module.exports.index=async (req,res) => {
    const allListings=await Listing.find({})
    res.render("./listings/index.ejs",{allListings});
};

//new route
module.exports.renderNewForm=(req,res) => {
    res.render("./listings/new.ejs");
};

//SHOW ROUTE
module.exports.showRoute=async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
        .populate({path : "reviews", populate : { path : "author"}})
        .populate("owner");
        if(!listing){
            req.flash("error","Listing you requested doesnt exist");
            res.redirect("/listings")
        }
        res.render("./listings/show.ejs", { listing });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

//CREATE ROUTE
module.exports.createRoute=async (req,res ,next) => {
    let response= await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();
    
    let url = req.file.path;
    let filename= req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image= { url , filename};
    newListing.geometry =response.body.features[0].geometry;

    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New listing created");
    res.redirect("/listings");
};

//EDIT ROUTE
module.exports.editRoute=async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested doesnt exist");
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("./listings/edit.ejs", { listing ,originalImageUrl}); 
};

//UPDATE ROUTE
module.exports.updateRoute=async (req,res) => {
    let { id } = req.params; 
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename= req.file.filename;
        listing.image= { url , filename};
        await listing.save();
    }

    req.flash("success","Review Updated");
    res.redirect("/listings");
};

//DELETE ROUTE
module.exports.deleteRoute=async (req,res) => {
    let { id } = req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")
    res.redirect("/listings");
};

// In your controller
module.exports.searchRoute = async (req, res) => {
    try {
        const { query } = req.query;

        const searchResults = await Listing.find({
            $or: [
                { location: { $regex: new RegExp(query, 'i') } },
                { country: { $regex: new RegExp(query, 'i') } }
                // Add more fields as needed for search
            ],
        });

        res.render('./listings/search.ejs', { searchResults: searchResults || [] });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
