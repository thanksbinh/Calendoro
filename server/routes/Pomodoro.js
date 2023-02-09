const key = require("../key/key");
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
            console.log(`   start: ${result.start}`);
        });
    } else {
        console.log(`No listings found`);
    }

    return results;
}

router.get('/', async (req, res) => {
    const uri = key.mongoURI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const listOfReps = await findListingByUserId(client, 02);
        res.json(listOfReps);
    } catch(err) {
        console.log(err);
    } finally {
        await client.close();
    }
})

router.post('/', async (req, res) => {
    const uri = key.mongoURI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const postRep = await createListing(client, req.body);
        res.json(postRep);
    } catch(err) {
        console.log(err);
    } finally {
        await client.close();
    }
})

module.exports = router;