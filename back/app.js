const express = require('express');
const app = express();
const http = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = 8080;

app.get('/', (req, res) => {
  res.send('hello world');
});

io.on('connection', (socket) => {
    console.log("connected");
  });

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});