const express = require("express");
const {MongoClient} = require("mongodb");
const router = express.Router();

async function createListing(client, newListing){
    const result = await client.db("myCollection").collection("pomodoro").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function findOneListingByUserId(client, userId) {
    const result = await client.db("myCollection").collection("pomodoro").findOne({ "UserId": userId });

    if (result) {
        console.log(`Found a listing in the collection with the name '${userId}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${userId}'`);
    }

    return result;
}

const uri = "mongodb+srv://binh191519:191519@cluster0.8cmz8la.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

router.get('/', async (req, res) => {
    await client.connect();
    const listOfReps = await findOneListingByUserId(client, 02);
    res.json(listOfReps);
})

router.post('/', async (req, res) => {
    await client.connect();
    const postRep = await createListing(client, {  
        "UserId": 02,
        "Start": new Date(), 
        "Durration": 0, 
        "Task": "Test create listing"
    });
    res.json(postRep);
})

module.exports = router;