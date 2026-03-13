const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const { connectToMongo } = require('./models/conn');
const { User, Lab, Reservation } = require('./models/models');

const app = express();
const PORT = 3000;

app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes 
app.get('/', (req, res) => res.render('login'));
app.get('/home', (req, res) => res.render('home'));
app.get('/sign_up', (req, res) => res.render('sign_up'));
app.get('/reserve', (req, res) => res.render('reserve'));
app.get('/search', (req, res) => res.render('search'));
app.get('/profile', (req, res) => {
    res.render('user_profile'); 
});
app.get('/api/users/:username', async (req, res) => {
    try {
        const requestedUsername = req.params.username;
        
        const user = await User.findOne({ username: requestedUsername });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const reservation = await Reservation.findOne({ 
            username: requestedUsername, 
            status: "Reserved" 
        });

        res.json({ user, reservation }); 
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});
app.get('/api/all-reservations', async (req, res) => {
    try {
        const allReservations = await Reservation.find({});
        res.json(allReservations);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to fetch all reservations" });
    }
});

// Initialization of AnimoSync
connectToMongo((err) => {
    if (err) {
        console.error("Failed to connect to the database. Exiting...");
        process.exit(1);
    }

    app.get('/api/reservations/:labId', async (req, res) => {
        try {
            const requestedLabId = req.params.labId; 
            const reservations = await Reservation.find({ lab_id: requestedLabId });
            res.json(reservations); 

        } catch (error) {
            console.error("Database error:", error);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    });
    
    app.listen(PORT, () => {
        console.log(`AnimoSync server running at http://localhost:${PORT}`);
    });
});