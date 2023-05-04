import React from "react";
import { io } from "socket.io-client";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";

export default function GameStatusComponent() {
	function onSocket(state) {
		console.log(state);

		const socket = io("https://k8e202.p.ssafy.io", {
			path: "/socket.io",
			// transports: ["websocket"],
		});

		socket.emit("sim_control", state);

		socket.on("hi", data => console.log(data)); // 서버 -> 클라이언트
	}

	return (
		<div className="h-28 p-2 w-full">
			<div className="float-left m-4 ml-10 font-bold">
				<div>서버 연결 상태 : 연결완료</div>
			</div>

			<div className="float-right w-60 mr-4">
				<div
					className="float-left w-1/3 text-center cursor-pointer"
					onClick={() => {
						onSocket("pause");
					}}
				>
					<PauseCircleOutlineIcon sx={{ fontSize: 50 }} />
				</div>
				<div
					className="float-left w-1/3 text-center cursor-pointer"
					onClick={() => {
						onSocket("play");
					}}
				>
					<PlayCircleOutlineIcon sx={{ fontSize: 50 }} />
				</div>
				<div
					className="float-left w-1/3 text-center cursor-pointer"
					onClick={() => {
						onSocket("stop");
					}}
				>
					<StopCircleOutlinedIcon sx={{ fontSize: 50 }} />
				</div>
			</div>
		</div>
	);
}
