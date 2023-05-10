import React from "react";
import { io } from "socket.io-client";

export default function App() {
	// const onSocket = () => {
	//     const socket = io("https://k8e202.p.ssafy.io", {
	//         path: "/socket.io",
	//         // transports: ["websocket"],
	//     });
	//     socket.emit("sim_control", "pause");
	//     socket.on("hi", (data) => console.log(data)); // 서버 -> 클라이언트
	// };
	// return <button onClick={onSocket}>일시정지</button>;
}
