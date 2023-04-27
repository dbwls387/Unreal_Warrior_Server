const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', function(req, res) {
  res.send('Hello World');
});

io.on('connection', function(socket) {
    console.log('CONNECT');
});

server.listen(PORT, () => {
    console.log(`Server running on http://k8e202.p.ssafy.io:${PORT}`);
});