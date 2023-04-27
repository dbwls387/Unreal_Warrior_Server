const express = require('express');
const https = require('https');
const app = express();
const server = https.createServer(app);

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