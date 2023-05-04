const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

const tf = require("@tensorflow/tfjs-node");
const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function loadModel(inputData) {
    const model = await tf.loadLayersModel(
        "file://" + path.join(__dirname, "model.json")
    );
     // 입력 데이터 정의
    console.log(inputData);
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

// get 으로 딥러닝 모델이 있는지만, 작동하는지만 확인용 
// app.get("/model", (req, res) => {
//     console.error("ㅇㅅㅇ");
//     loadModel().then((result) => {
//         res.send(result);
//     });
// });

app.post("/model", (req, res) => {
    console.log(req.body)
    loadModel(req.body).then(result => {
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
        let inputData = {};
        for (let i = 0; i < data.length; i++) {
            const x = data[i].x;
            const y = data[i].y;
            const hp = data[i].hp;

            const xKey = "x" + (i + 1).toString();
            const yKey = "y" + (i + 1).toString();
            const hpKey = "hp" + (i + 1).toString();
            
            inputData[xKey] = x;
            inputData[yKey] = y;
            inputData[hpKey] = hp;
        }
        const result = loadModel(inputData);
        socket.broadcast.emit("actor_status", result);
        console.log("actor_status; ", result);
    });

    socket.on("sim_control", (data) => {
        io.emit("sim_control", data);
        console.log("sim_control: ", data);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
