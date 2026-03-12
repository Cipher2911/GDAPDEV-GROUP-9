const mongoose = require("mongoose");
const { timeStamp } = require("node:console");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        id: { type: Number, required: true },
        college: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String, required: true },
        reservation: { type: ObjectId, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
