const mongoose = require('mongoose'); 

const user_schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    dlsu_id: { type: String, required: true },
    college: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: true }
});

const User = mongoose.model('User', user_schema); 

// Lab Model 
const lab_schema = new mongoose.Schema({
    lab_id: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },                
    type: { type: String, required: true },                 
    stations: [{ type: String }]                            
});

const Lab = mongoose.model('Lab', lab_schema);

// Reservation Model 
const reservation_schema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    lab_id: { type: String, required: true },
    station: { type: String, required: true },
    status: { type: String, enum: ['Available', 'Reserved', 'Unavailable'], default: 'Available' },
    username: { type: String, default: null } 
});

const Reservation = mongoose.model('Reservation', reservation_schema);

// Export the models using CommonJS
module.exports = {
    User,
    Lab,
    Reservation
};