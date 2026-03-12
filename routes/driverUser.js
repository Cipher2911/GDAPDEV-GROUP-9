const express = require("express");

const { getMongoDB } = require("../db/conn");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const db = getMongoDB();

        const user = {
            name: req.body.name,
            id: req.body.id,
            college: req.body.college,
            email: req.body.email,
            avatar: req.body.avatar,
            reservation: { 
                location: req.body.location,
                station: req.body.station,
                time: req.body.time
            }
        };

        const result = await db.collection("users").insertOne(user);
        res.status(200).json({_id: result.insertedId, ...doc});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});
