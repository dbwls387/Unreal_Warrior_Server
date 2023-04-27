const app = require('express')();
// const fs = require('fs');
// const https = require('https');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 8080;

app.get('/', function(req, res) {
    io.on('connection', function(socket) {
        console.log('connected');
    });
    res.send('Hello World');
})

// const option = {
//     ca: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/fullchain.pem'),
//     key: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/privkey.pem'),
//     cert: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/cert.pem')
// };

http.listen(PORT, () => {
    console.log(`Server running on https://k8e202.p.ssafy.io:${PORT}`);
});