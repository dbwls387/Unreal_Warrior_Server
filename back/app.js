const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

const tf = require('@tensorflow/tfjs-node');
const path = require('path');

async function loadModel() {
  const model = await tf.loadLayersModel('file://' + path.join(__dirname, 'model.json'));
  const inputData = tf.tensor3d([[
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
 ]]);
 const prediction = model.predict(inputData);

 prediction.print();

 const result = await prediction.array();
 console.log("dtdat", result[0]);
 return result[0];
}

app.get("/model", (req, res) => {
  console.log("콘솔로그");
//   loadModel();
  res.send("리스폰스");
  debug.log("디버그로그");
});

app.get("/", (req, res) => {
    res.redirect("https://k8e202.p.ssafy.io");
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
