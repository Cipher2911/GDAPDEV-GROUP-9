import { ObjectId } from "bson";

const mongoose = require("mongoose");
const { timeStamp } = require("node:console");

const reserveSchema = new mongoose.Schema(
    {
        userReserved: { type: ObjectId, required: true },
        roomReserved: { type: ObjectId, required: true },
        dateReserved: { type: Date, required: true },
        dateMade: { type: Date, required: true },
        status: { type: String, default: "Activeee" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reservation", reserveSchema);