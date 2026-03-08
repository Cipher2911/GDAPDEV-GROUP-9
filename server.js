const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up Handlebars as the view engine
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES ---
app.get('/', (req, res) => res.render('login'));
app.get('/home', (req, res) => res.render('home'));
app.get('/sign_up', (req, res) => res.render('sign_up'));
app.get('/reserve', (req, res) => res.render('reserve'));
app.get('/search', (req, res) => res.render('search'));
app.get('/profile', (req, res) => {
    res.render('user_profile'); 
});

app.listen(PORT, () => {
    console.log(`AnimoSync server running at http://localhost:${PORT}`);
});