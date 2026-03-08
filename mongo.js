//For MongoDB

import 'dotenv/config'; 

import { connectToMongo, getDb } from './db/conn.js'; 

connectToMongo((err) => {
    if(err) {
        console.log("Error Ocurred: "); 
        console.error(err); 
        process.exit(); 
    }
    console.log("Connected to MongoDB Server"); 

    const db = getDb(); 
}); 