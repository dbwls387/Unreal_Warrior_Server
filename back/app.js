const express = require('express');
const io = require('socket.io')(https, {cors : {origin : '*'}});

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server running on http://k8e202.p.ssafy.io:${PORT}`);
});

io.on('connection', function(socket) {
    console.log(socket.id, 'Connected');
    socket.emit('msg', socket.id + ' 연결되었습니다.');

    socket.on('msg', function(data) {
        console.log(socket.id, data);

        socket.emit('msg', `Server ${data}를 받았습니다.`);
    });
});