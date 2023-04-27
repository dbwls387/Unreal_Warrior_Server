const express = require('express');

const app = express();
const PORT = 8080;

const server = require('https').createServer(app);
const io = require('socket.io')(server);

app.get("/", (req, res) => {
    res.send('Hello World');
});

io.on('connection', function(socket) {
    console.log('CONNECT');
});

server.listen(PORT, () => {
    console.log(`Server running on http://k8e202.p.ssafy.io:${PORT}`);
});