import React, { useState } from "react";
import { io } from "socket.io-client";

import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";

import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";
import Filter4Icon from "@mui/icons-material/Filter4";
import Filter5Icon from "@mui/icons-material/Filter5";
import Filter6Icon from "@mui/icons-material/Filter6";
import Filter7Icon from "@mui/icons-material/Filter7";
import Filter8Icon from "@mui/icons-material/Filter8";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import Skull from "../assets/skull.png";

export default function GameStatusComponent(props) {
	const socketId = localStorage.getItem("socketId");
	const [toggle, setToggle] = useState(true);
	const socket = io("https://k8e202.p.ssafy.io", {
		path: "/socket.io",
		cors: {
			origin: "*",
			credentials: true,
		},
	});

	function onSocket(state) {
		const data = {
			toId: socketId,
			control: state,
		};
		socket.emit("sim_control", data);
	}

	function onCameraSocket(state) {
		const data = {
			toId: socketId,
			camera: state ? 1 : 0,
		};
		socket.emit("camera_control", data);
	}

	function onChoicePlayer(player) {
		const data = {
			toId: socketId,
			player: player,
			mainViewPort: player === -1 ? 0 : 1,
		};

		console.log("choice ", data.toId, " ", data.toId.length);

		socket.emit("choice_player_react", data);
	}

	return (
		<div className="h-28 p-2 w-full ">
			{/* 플레이어 선택 */}
			<div
				className="float-left m-4 ml-3 cursor-pointer"
				onClick={() => {
					onChoicePlayer(0);
				}}
			>
				<Filter1Icon sx={{ fontSize: 35 }} />
			</div>
			<div
				className="float-left m-4 ml-3 cursor-pointer"
				onClick={() => {
					onChoicePlayer(1);
				}}
			>
				<Filter2Icon sx={{ fontSize: 35 }} />
			</div>
			<div
				className="float-left m-4 ml-3 cursor-pointer"
				onClick={() => {
					onChoicePlayer(2);
				}}
			>
				<Filter3Icon sx={{ fontSize: 35 }} />
			</div>
			<div
				className="float-left m-4 ml-3 cursor-pointer"
				onClick={() => {
					onChoicePlayer(3);
				}}
			>
				<Filter4Icon sx={{ fontSize: 35 }} />
			</div>
			<div
				className="float-left m-4 ml-3 cursor-pointer"
				onClick={() => {
					onChoicePlayer(4);
				}}
			>
				<Filter5Icon sx={{ fontSize: 35 }} />
			</div>
			<div
				className="float-left m-4 ml-3 cursor-pointer"
				onClick={() => {
					onChoicePlayer(5);
				}}
			>
				<Filter6Icon sx={{ fontSize: 35 }} />
			</div>
			<div
				className="float-left m-4 ml-3 cursor-pointer"
				onClick={() => {
					onChoicePlayer(6);
				}}
			>
				<Filter7Icon sx={{ fontSize: 35 }} />
			</div>
			<div
				className="float-left m-4 ml-3 cursor-pointer"
				onClick={() => {
					onChoicePlayer(7);
				}}
			>
				<Filter8Icon sx={{ fontSize: 35 }} />
				{/* <img src={Skull} alt="logo" className="h-12 w-12" /> */}
			</div>
			<div
				className="float-left m-4 ml-3 cursor-pointer"
				onClick={() => {
					onChoicePlayer(-1);
				}}
			>
				<SwitchAccountIcon sx={{ fontSize: 36 }} />
			</div>

			{/* 일시정지, 재생, 멈춤 */}
			<div className="float-right w-64 mt-3 mr-4">
				<div
					className="float-left w-1/4 text-center cursor-pointer"
					onClick={() => {
						onSocket("pause");
					}}
				>
					<PauseCircleOutlineIcon sx={{ fontSize: 50 }} />
				</div>
				<div
					className="float-left w-1/4 text-center cursor-pointer"
					onClick={() => {
						onSocket("play");
					}}
				>
					<PlayCircleOutlineIcon sx={{ fontSize: 50 }} />
				</div>
				<div
					className="float-left w-1/4 text-center cursor-pointer"
					onClick={() => {
						onSocket("stop");
					}}
				>
					<StopCircleOutlinedIcon sx={{ fontSize: 50 }} />
				</div>

				{/* 카메라 전환 */}
				<div
					className="float-left w-1/4 text-center cursor-pointer pl-7 mt-2"
					ocClick={() => {
						setToggle(!toggle);
						onCameraSocket();
					}}
				>
					<FlipCameraIosIcon sx={{ fontSize: 35 }} />
				</div>
			</div>
		</div>
	);
}
