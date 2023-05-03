const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

const tf = require("@tensorflow/tfjs-node");
const path = require("path");

async function loadModel() {
    console.error("여기 문제 발생하는듯");
    const model = await tf.loadLayersModel(
        "file://" + path.join(__dirname, "model.json")
    );
    const inputData = tf.tensor3d([
        [
            [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1,
            ],
        ],
    ]);
    const prediction = model.predict(inputData);

    const result = await prediction.array();
    console.error("dtdat", result[0]);
    return result[0];
}

app.get("/", (req, res) => {
    res.redirect("https://k8e202.p.ssafy.io");
    console.error("이거왜안대");
});

app.get("/model", (req, res) => {
    console.error("ㅇㅅㅇ");
    loadModel().then((result) => {
        res.send(result);
    });
});

io.on("connection", (socket) => {
    console.log("Connected!");

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
        console.log(msg);
    });

    socket.on("actor_status", (data) => {
        io.emit("actor_status", data);
        console.log("actor_status; ", data);
    });

    socket.on("sim_control", (data) => {
        io.emit("sim_control", data);
        console.log("sim_control: ", data);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
