const app = require('express')();
// const fs = require('fs');
// const https = require('https');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 8080;

app.get('/', function(req, res) {
    res.send('Hello World'); 
});

const httpServer = http.listen(PORT, () => {
    console.log(`Server running on https://k8e202.p.ssafy.io:${PORT}`);
});

const socketServer = io(httpServer, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
});

socketServer.on('connect', (socket) => {
    socket.on('test', (req) => {
        console.log(req);
    })
});