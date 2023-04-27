const express = require('express');
const app = express();

const ws = require('ws');

const PORT = 8080;

app.get('/', function(req, res) {
  res.send('Hello World');
});

const wsSocketServer = new ws.Server(
    {
        server: 'https://k8e202.p.ssafy.io',
        port: 8080
    }
);

// io.on('connection', function(socket) {
//     console.log('CONNECT');
// });

wsSocketServer.on('connection', (ws, request) => {
    console.log('CONNECTED');
});

app.listen(PORT, () => {
    console.log(`Server running on https://k8e202.p.ssafy.io:${PORT}`);
});