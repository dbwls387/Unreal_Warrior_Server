const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

const tf = require('@tensorflow/tfjs');

async function loadModel() {
  const model = await tf.loadLayersModel('model.json');
  model.predict(tf.tensor3d([[0.5, 0.5, 0.5]])).print();
}

app.get("/model", (req, res) => {
  debug.log("/model");
  loadModel();
});

app.get("/", (req, res) => {
    // res.redirect("https://k8e202.p.ssafy.io");
});

io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });
});

io.on("connection", (socket) => {
    socket.on("actor_status", (msg) => {
        io.emit("actor_status", msg);
        console.log(msg);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
