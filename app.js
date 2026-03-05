const express = require('express'); 
const path = require('path'); 

const app = express(); 
const PORT = 3000; 

app.use(express.static(__dirname));

//URL Routes 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/reserve', (req, res) => {
    res.sendFile(path.join(__dirname, 'reserve.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'search.html'));
});

app.get('/user_profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'user_profile.html'));
});

// Running the Server 

app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
});

