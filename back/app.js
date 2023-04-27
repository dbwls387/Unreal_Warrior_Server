const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();

const PORT = 8080;

const option = {
    ca: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/fullchain.pem'),
    key: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/privkey.pem'),
    cert: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/cert.pem')
};

const server = https.createServer(option, app);

const io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.send("Hello World");
});

io.sockets.on('connection', function(socket) {
    console.log('CONNECT');
});

server.listen(PORT, () => {
    console.log(`Server running on https://k8e202.p.ssafy.io:${PORT}`);
});