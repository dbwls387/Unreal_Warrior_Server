const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

const tf = require("@tensorflow/tfjs-node");
const path = require("path");

async function loadModel() {
    const model = await tf.loadLayersModel(
        "file://" + path.join(__dirname, "model.json")
    );
     // 입력 데이터 정의
    var as = Object.keys(inputData).map(key => inputData[key]);

     // 현재(일시적)의 데이터만을 입력으로 받는다면 아래와 같은 형식을 가지지만, 이전의 과거 데이터까지 포함된다면 달라져야함
    const tensorData = tf.tensor3d(
        as, [1, 1, 48]
    );

    // 예측 수행
    const prediction = model.predict(tensorData);

    // 결과 출력
    prediction.print();

    const result = await prediction.array();
    console.log("dtdat", result[0]);
    return result[0];
}

app.get("/", (req, res) => {
    res.redirect("https://k8e202.p.ssafy.io");
    console.error("이거왜안대");
});

// app.get("/model", (req, res) => {
//     console.error("ㅇㅅㅇ");
//     loadModel().then((result) => {
//         res.send(result);
//     });
// });

app.post("/model", (req, res) => {
    loadModel(res.req.body).then(result => {
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
