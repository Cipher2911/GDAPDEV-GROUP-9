const mongoose = require('mongoose'); 

//User Model
const user_schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true},
    dlsu_id: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    avatar: { type: String, required: true, trim: true }, 
    password: { type: String, required: true, trim: true }
});

const User = mongoose.model('User', user_schema); 

//Admin Model 

const admin_schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true }, 
    name: { type: String, required: true, trim: true }, 
    admin_id: { type: String, required: true, trim: true }, 
    email: { type: String, required: true, trim: true }, 
    avatar: { type: String, required: true, trim: true }, 
    password: { type: String, required: true, trim: true }
}); 

const Admin = mongoose.model('Admin', admin_schema); 

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
    username: { type: String, default: null }, 
    is_anonymous: { type: Boolean, default: false }
});

const Reservation = mongoose.model('Reservation', reservation_schema);

// Exporting the Models
module.exports = {
    User,
    Admin, 
    Lab,
    Reservation
};