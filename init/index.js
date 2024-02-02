const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("connected successfully");
    })
    .catch((err) => console.log(err)
);

const initDB=async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj) => ({...obj, owner: "65b6084b241d02a16fd76cd4"}));
    await Listing.insertMany(initData.data);
    console.log("data initialized");
};

initDB();