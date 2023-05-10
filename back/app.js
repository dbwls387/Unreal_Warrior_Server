const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

const tf = require("@tensorflow/tfjs-node");
const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let playerNumber = -1;

// delta
const dx = [ 1, 1, 0, -1, -1, -1, 0, 1 ];
const dy = [ 0, -1, -1, -1, 0, 1, 1, 1 ]

async function loadModel(inputData) {
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
    // prediction.print();

    const result = await prediction.array();
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
    loadModel(req.body).then(result => {
        res.send(result);
    });
});

app.post("/showPlayer", (req, res) => {
    playerNumber = req.body.playerNumber;
});

app.get("/hidePlayer", (req, res) => {
    playerNumber = -1;
});

io.on("connection", (socket) => {
    console.log(socket);
    socket.on("actor_status", async (data) => {
        if (data.data.length >= 16) {
            let inputData = {};
            let disArray = [];
            for (let i = 0; i < data.data.length; i++) {
                const x = data.data[i].x;
                const y = data.data[i].y;
                const hp = data.data[i].hp;
                const dis = data.data[i].dis;

                const xKey = "x" + (i + 1).toString();
                const yKey = "y" + (i + 1).toString();
                const hpKey = "hp" + (i + 1).toString();
                
                inputData[xKey] = x;
                inputData[yKey] = y;
                inputData[hpKey] = hp;

                disArray.push(dis);
            }

            if (playerNumber == -1) {
                const result = await loadModel(inputData);
                await socket.broadcast.emit("actor_status", data);
                await socket.broadcast.emit("win_rate", result);
            } else if (playerNumber >= 0 && playerNumber <= 7) {
                const result = await loadModel(inputData);
                const results = {};

                results["indi"] = [];

                let x = data.data[playerNumber].x;
                let y = data.data[playerNumber].y;

                for (let d = 0; d < 8; d++) {
                    let nx = x + dx[d] * disArray[playerNumber];
                    let ny = y + dy[d] * disArray[playerNumber];

                    inputData["x" + playerNumber.toString()] = nx;
                    inputData["y" + playerNumber.toString()] = ny;

                    const result2 = await loadModel(inputData);

                    const t = {};
                    t["nx"] = nx;
                    t["ny"] = ny;
                    t["win"] = result2[1];

                    results["indi"].push(t);

                    socket.broadcast.emit("actor_status", data);
                    socket.broadcast.emit("win_rate", result);
                    socket.broadcast.emit("direction", results);
                
                }
            } else {
                console.error("playerNumber가 잘못함");
            }
        }
    });

    socket.on("sim_control", (data) => {
        io.emit("sim_control", data);
        console.log("sim_control: ", data);
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
