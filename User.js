const mongoose = require("mongoose");
const { timeStamp } = require("node:console");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        idNum: { type: Number, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        active: { type: Boolean, default: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);