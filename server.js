require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session'); 
const bcrypt = require('bcrypt');

const { connectToMongo } = require('./models/conn');
const { User, Admin, Lab, Reservation } = require('./models/models');

const app = express();
const PORT = 3000;

app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ROUTES 

app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// GET Methods
app.get('/', (req, res) => res.render('login', { hideNav: true }));
app.get('/sign_up', (req, res) => res.render('sign_up', { hideNav: true }));
app.get('/home', (req, res) => res.render('home'));

app.get('/about_page', (req, res) => {
    res.render('about_page', { user: req.session?.user });
});

app.get('/reserve', (req, res) => {
    if (!req.session.user) return res.redirect('/'); 
    res.render('reserve', { user: req.session.user });
});

app.get('/search', (req, res) => {
    if (!req.session.user) return res.redirect('/'); 
    res.render('search', { user: req.session.user}); 
});

app.get('/profile', async (req, res) => {

    if (!req.session || !req.session.user) {
        return res.redirect('/'); 
    }

    if (!req.query.user) {
        return res.redirect(`/profile?user=${req.session.user.username}`);
    }

    const isOwnProfile = req.session.user.username === req.query.user;

    res.render('user_profile', { isOwnProfile });

});

app.get('/my-reservations', (req, res) => {

    if (!req.session.user) {
        return res.redirect('/'); 
    }
    res.render('my_reservations'); 

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
        const allReservations = await Reservation.find({}).lean();
        const currentUser = req.session.user ? req.session.user.username : null;
        
        const mappedReservations = allReservations.map(res => ({
            ...res,
            isMine: currentUser ? res.username === currentUser : false, 
            isAdmin: req.session.isAdmin || false
        }));
        res.json(mappedReservations);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to fetch all reservations" });
    }

});

//For Admin 
app.get('/admin_view', (req, res) => {
    if (!req.session.user || !req.session.isAdmin) {
        return res.redirect('/'); 
    }
    res.render('admin_view', { user: req.session.user });
});

// POST Methods 

//For Login
app.post('/login', async (req, res) => { 

    const { username, password } = req.body;

    try {
        let user = await User.findOne({ email: username });
        let isAdmin = false; 

        if (!user) {
            user = await Admin.findOne({ email: username });
            if (user) isAdmin = true;
        }
        
        if (!user) {
            return res.render('login', { 
                error: "Account doesn't exist.", 
                hideNav: true 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', { 
                error: "Incorrect password.", 
                hideNav: true, 
                formData: { username: username }
            });
        }

        req.session.user = user;
        req.session.isAdmin = isAdmin;
        
        if (isAdmin) {
            res.redirect('/admin_view');
        } else {
            res.redirect('/home');
        }

    } catch (error) {
        console.error("Login error:", error);
        res.render('login', {
            error: "An error occurred during login. Please try again.",
            hideNav: true
        });
    }
});

//For Sign Up 
app.post('/sign_up', async (req, res) => {

    try{ 
        const { name, username, dlsu_id, college, email, password } = req.body; 

        if (password !== req.body['confirm-password']) {
            return res.render('sign_up', { 
                error: "Passwords do not match.", 
                hideNav: true, 
                formData: req.body
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email },
                { dlsu_id: dlsu_id }
            ]
        });

        if (existingUser) {
            let errorMessage = "Account already exists.";
   
            if (existingUser.email === email) {
                errorMessage = "This DLSU Email is already in use.";
            } else if (existingUser.username === username) {
                errorMessage = "This Display Username is already taken.";
            } else if (String(existingUser.dlsu_id) === String(dlsu_id)) {
                errorMessage = "This DLSU ID Number is already registered.";
            }

            return res.render('sign_up', { 
                error: errorMessage, 
                hideNav: true, 
                formData: req.body
            });
        }

        const newAvatar = name.substring(0, 2).toUpperCase();

        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username: username, 
            name: name,
            dlsu_id: dlsu_id,
            college: college,
            email: email,           
            avatar: newAvatar, 
            password: hashedPassword       
        });

        await newUser.save();
        res.redirect('/');

    } catch (error) {
        console.error("Signup error: ", error); 
        res.render('sign_up', { 
            error: "An unexpected error occurred. Please try again.", 
            hideNav: true, 
            formData: req.body
        });
    }

});

//For Reservations
app.post('/api/reserve', async (req, res) => {

    if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

    try {
        const { date, time, lab_id, station } = req.body;
        const myUsername = req.session.user.username; 

        const reservation = await Reservation.findOneAndUpdate(
            { date, time, lab_id, station, status: 'Available' },
            { status: 'Reserved', username: myUsername },
            { returnDocument: 'after' } 
        );

        if (reservation) {
            res.json({ success: true, message: "Reservation successful!" });
        } else {
            res.status(400).json({ success: false, message: "You have already reserved this spot." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to process reservation." });
    }

});

// For Searching Slots
app.post('/api/search-slots', async (req, res) => {

    try {
        const { lab, date, time } = req.body;
      
        let dbQuery = { status: 'Available' };

        if (lab && lab !== "all") {
            dbQuery.lab_id = lab;
        }
        if (date && date.trim() !== "") {
            dbQuery.date = { $regex: date, $options: 'i' }; 
        }
        if (time && time.trim() !== "") {
            dbQuery.time = { $regex: time, $options: 'i' };
        }

        const filteredSlots = await Reservation.find(dbQuery).lean();
        
        res.json(filteredSlots);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Failed to search reservations." });
    }

});

// PATCH Method for Cancellations 
app.patch('/api/cancel', async (req, res) => {

    if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

    try {
        const { date, time, lab_id, station, targetUsername } = req.body;
        const myUsername = req.session.user.username;
        const isAdmin = req.session.isAdmin; 

        let query = { date, time, lab_id, station, status: 'Reserved' };

        if (!isAdmin) {
            query.username = myUsername
        } else if (targetUsername) {
            query.username = targetUsername;
        }

        const reservation = await Reservation.findOneAndUpdate(
            query, 
            { status: 'Available', username: null },
            { returnDocument: 'after' } 
        );

        if (reservation) {
            res.json({ 
                success: true, 
                message: isAdmin ? `Reservation cancelled by Admin.` : "Reservation cancelled successfully!" 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: "Could not cancel. Slot not found or unauthorized." 
            });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to process cancellation." });
    }

});

// DELETE Methods 
app.delete('/api/user/delete', async (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ error: "Not logged in" });
    }

    const myUsername = req.session.user.username;

    try {
        await Reservation.updateMany(
            { username: myUsername, status: 'Reserved' },
            { status: 'Available', username: null }
        );

        const deletedUser = await User.findOneAndDelete({ username: myUsername });

        if (deletedUser) {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ error: "Could not log out after deletion." });
                }
                res.json({ success: true, message: "Profile successfully deleted." });
            });
        } else {
            res.status(404).json({ success: false, message: "User not found." });
        }
    } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ error: "Failed to delete profile." });
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
            const reservations = await Reservation.find({ lab_id: requestedLabId }).lean();
            const currentUser = req.session.user ? req.session.user.username : null;

            const mappedReservations = reservations.map(res => ({
                ...res,
                isMine: res.username === currentUser
            }));
            res.json(mappedReservations); 

        } catch (error) {
            console.error("Database error:", error);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    });
    
    app.listen(PORT, () => {
        console.log(`AnimoSync server running at http://localhost:${PORT}`);
    });
    
});

