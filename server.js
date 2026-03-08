const http = require('http'); 
const fs = require('fs'); 
const path = require('path');

const PORT = 3000; 

// Extension Types for Files
const EXTENSIONS = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
    console.log("Incoming request received:", req.method, req.url); 

    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = parsedUrl.pathname;

    // Route Points

    switch (pathname) {
        case "/":
            pathname = "./frontend/login.html";
            break;
        case "/sign_up": 
            pathname = "./frontend/sign_up.html"; 
            break; 
        case "/home":
            pathname = "./frontend/home.html";
            break;
        case "/reserve":
            pathname = "./frontend/reserve.html";
            break;
        case "/search":
            pathname = "./frontend/search.html";
            break;
        case "/user_profile":
            pathname = "./frontend/user_profile.html";
            break;
        default: 
            pathname = `./frontend${pathname}`; 
            break; 
    }

    const filePath = path.join(__dirname, pathname);
    const extname = path.extname(filePath);
    
    const contentType = EXTENSIONS[extname] || 'text/plain';

    // Handling Different Status Codes 
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
            } else {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        }
    });
}); 

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});
