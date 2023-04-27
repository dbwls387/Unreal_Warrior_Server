const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io');
const cors = require('cors');

app.use(cors());

const PORT = 8080;

app.get('/', function(req, res) {
    res.send('Hello World'); 
});

const httpServer = http.listen(PORT, () => {
    console.log(`Server running on https://k8e202.p.ssafy.io:${PORT}`);
});

const socketServer = io(httpServer, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
});

app.get('/socket.io', function(req, res) {
    socketServer.on('connect', (socket) => {
        socket.on('test', (req) => {
            console.log(req);
        });
    
        socket.broadcast.emit('user joined', {
            username: socket.username
        })
    });
});