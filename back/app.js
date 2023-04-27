const express = require('express');
const io = require('socket.io')();

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server running on http://k8e202.p.ssafy.io:${PORT}`);
});

app.io = require('socket.io')();

app.io.on('connection',(socket) => {
  console.log('유저가 들어왔다');

  socket.on('disconnect', () => {
      console.log('유저 나갔다');
  });

  socket.on('chat-msg', (msg) => {
    app.io.emit('chat-msg', msg);
  });

});