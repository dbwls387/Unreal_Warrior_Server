var app = require('express')();
var io = require('socket.io')(app);

const PORT = 8080;

app.get('/', (req, res) => {
  res.send('hello world');
});

io.on('connection', function(socket) {
    console.log("CONNECTED");
});

app.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});