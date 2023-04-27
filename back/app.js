var app = require('express')();
var server = require('https').createServer(app);
var io = require('socket.io')(server);

const PORT = 8080;

app.get('/', (req, res) => {
  res.send('hello world');
});

io.on('connection', function(socket) {
    console.log("CONNECTED");
});

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});