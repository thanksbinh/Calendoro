const express = require("express");
const {MongoClient} = require("mongodb");
const router = express.Router();

async function createListing(client, newListing){
    const result = await client.db("myCollection").collection("pomodoro").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function findListingByUserId(client, userId) {
    const cursor = await client.db("myCollection").collection("pomodoro").find({ "userId": userId });

    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`Found listing(s):`);
        results.forEach((result, i) => {
            console.log();
            console.log(`${i + 1}. title: ${result.title}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   end: ${result.end}`);
            console.log(`   start: ${new Date(result.start).toDateString()}`);
        });
    } else {
        console.log(`No listings found`);
    }

    return results;
}

const uri = "mongodb+srv://binh191519:191519@cluster0.8cmz8la.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

router.get('/', async (req, res) => {
    await client.connect();
    const listOfReps = await findListingByUserId(client, 02);
    res.json(listOfReps);
})

router.post('/', async (req, res) => {
    await client.connect();
    const postRep = await createListing(client, {  
        "userId": 02,
        "start": new Date(new Date().getTime() - 25*60000), 
        "end": new Date(), 
        "title": "Test create listing"
    });
    res.json(postRep);
})

module.exports = router;