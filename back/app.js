const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

const tf = require("@tensorflow/tfjs-node");
const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// let playerNumber = -1;

let map = new Map();
let set = new Set();

// delta
const dx = [1, 1, 0, -1, -1, -1, 0, 1];
const dy = [0, -1, -1, -1, 0, 1, 1, 1];

let model = null;

async function loadModel(inputData) {
    if (model == null) {
        model = await tf.loadLayersModel(
            "file://" + path.join(__dirname, "model.json")
        );
    }
    // 입력 데이터 정의
    var as = Object.keys(inputData).map(key => inputData[key]);

    // 현재(일시적)의 데이터만을 입력으로 받는다면 아래와 같은 형식을 가지지만, 이전의 과거 데이터까지 포함된다면 달라져야함
    const tensorData = tf.tensor3d(as, [1, 1, 48]);

    // 예측 수행
    const prediction = model.predict(tensorData);

    // 결과 출력
    // prediction.print();

    const result = await prediction.array();
    return result[0];
}

app.get("/", (req, res) => {
    res.redirect("https://k8e202.p.ssafy.io");
});

app.post("/showPlayer", (req, res) => {
    playerNumber = req.body.playerNumber;
});

app.get("/hidePlayer", (req, res) => {
    playerNumber = -1;
});

io.on("connection", socket => {
    const socketId = socket.id;
    console.log(socketId);

    socket.on("join_room", data => {
        console.log("join", data);

        var macAddress = "";
        if (typeof data === "string") macAddress = data;
        else macAddress = data.join(".");

        socket.join(macAddress);
        set.add(macAddress);

        console.log(socket.rooms);
    });

    if (map.get(socketId) == undefined) {
        map.set(socketId, -1);
    }

    socket.on("unreal_socket_id", data => {
        console.log("set", set);
        console.log("data.id", data.id);
        if (set.has(data.mac)) {
            io.sockets.in(data.id).emit("connect_unreal", true);
            console.log("has? ", data.mac);
        } else {
            io.sockets.in(data.id).emit("connect_unreal", false);
        }
    });

    socket.on("actor_status", async data => {
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

            if (map.get(socketId) == -1) {
                const result = await loadModel(inputData);
                await io.to(socketId).emit("win_rate", result);
            } else if (map.get(socketId) >= 0 && map.get(socketId) <= 7) {
                const result = await loadModel(inputData);
                const results = [];

                let x = data.data[map.get(socketId)].x;
                let y = data.data[map.get(socketId)].y;

                for (let d = 0; d < 8; d++) {
                    let nx = x + dx[d] * disArray[map.get(socketId)];
                    let ny = y + dy[d] * disArray[map.get(socketId)];

                    inputData["x" + (map.get(socketId) + 1).toString()] = nx;
                    inputData["y" + (map.get(socketId) + 1).toString()] = ny;

                    const result2 = await loadModel(inputData);

                    const t = {};
                    t["nx"] = nx;
                    t["ny"] = ny;
                    t["win"] = result2[1];

                    results.push(t);
                }

                results.sort(function (a, b) {
                    return b.win - a.win;
                });

                await io.to(socketId).emit("win_rate", result);
                await io.to(socketId).emit("direction", results);
            } else {
                console.error("playerNumber가 잘못함");
            }
        }
    });

    socket.on("change_player", data => {
        map.set(socketId, data);
    });

    socket.on("sim_control", data => {
        console.log(data);
        io.to(data.macAddress).emit("sim_control_unreal", data.control);
    });

    socket.on("start_game", data => {
        io.to(data).emit("start_game_unreal", true);
    });

    socket.on("camera_control", data => {
        io.to(data.macAddress).emit("direction_camera", data.camera);
    });

    socket.on("choice_player_react", data => {
        io.to(data.macAddress).emit("choice_player", data.playerNumber);
        io.to(data.macAddress).emit("main_viewport", data.mainViewport);
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
