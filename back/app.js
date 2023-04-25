const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const HOST = "http://k8e202.p.ssafy.io/"
const PORT = 8080;

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, HOST, () => {
    console.log(`Server running on ${hostName}:${PORT}`);
});