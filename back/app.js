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
 console.log("예측결과11 : ", result[0]);
 return result[0];
}

app.get("/api/model", (req, res) => {
  console.log("/model");

  loadModel().then(result => {
  res.send(result);
  });
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
