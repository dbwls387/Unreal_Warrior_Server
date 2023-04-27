const app = require('express')();
const io = require('socket.io');

app.get('/', function(req, res) {
  res.send('Hello World');
});

// io.on('connection', function(socket) {
//     console.log('CONNECT');
// });

app.listen(PORT, () => {
    console.log(`Server running on http://k8e202.p.ssafy.io:${PORT}`);
});