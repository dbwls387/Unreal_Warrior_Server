const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.redirect('https://k8e202.p.ssafy.io');
});

io.on('connection', (socket) => {
  console.log(socket);
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on('actor status', msg => {
    console.log(msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});