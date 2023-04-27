const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();

const options = {
    key: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/fullchain.pem'),
    cert: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/privkey.pem')
};

const server = https.createServer(options, app);

const PORT = 8080;

server.get('/', function(req, res) {
  res.send('Hello World');
});

// io.on('connection', function(socket) {
//     console.log('CONNECT');
// });

server.listen(PORT, () => {
    console.log(`Server running on http://k8e202.p.ssafy.io:${PORT}`);
});