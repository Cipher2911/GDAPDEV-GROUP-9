const mongoose = require('mongoose'); 

const mongoURI = "mongodb://localhost:27017/AnimoSync"; 

function connectToMongo(callback){

   mongoose.connect(mongoURI)
        .then(() => {
            console.log("Connected to MongoDB using Mongoose!");
            return callback(); 
        })
        .catch(err => {
            console.error("Mongoose connection error:", err);
            callback(err); 
        });

}

function signalHandler() {
    console.log("Closing MongoDB connection..."); 
    mongoose.connection.close(); // Use mongoose to close
    process.exit(); 
}

process.on('SIGINT', signalHandler); 
process.on('SIGTERM', signalHandler); 
process.on('SIGQUIT', signalHandler);

// Export the functions using CommonJS
module.exports = {
    connectToMongo
};