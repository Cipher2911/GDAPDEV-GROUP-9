const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomNum: { type: Number, required: true },
        building: { type: String, required: true },
        type: { type: String, required: true },
        active: { type: String, default: true }
    }
);

module.exports = mongoose.model("Room", roomSchema);