const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();

const PORT = 8080;

const option = {
    ca: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/fullchain.pem'),
    key: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/privkey.pem'),
    cert: fs.readFileSync('/var/jenkins_home/workspace/deploy/sslkey/cert.pem')
};

const server = https.createServer(option, (req, res) => {
    console.log(req);
    res.send("Hello World");
});

server.listen(PORT, () => {
    console.log(`Server running on https://k8e202.p.ssafy.io:${PORT}`);
});