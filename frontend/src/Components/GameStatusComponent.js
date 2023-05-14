import React from "react";
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
import Skull from "../assets/skull.png";

export default function GameStatusComponent({ socket }) {
	const socketId = localStorage.getItem("socketId");

	function onSocket(state) {
		console.log(state);

		const data = {
			toId: socketId,
			control: state,
		};
		socket.emit("sim_control", data);
	}

	return (
		<div className="h-28 p-2 w-full ">
			<div className="float-left m-4 ml-3 cursor-pointer">
				<Filter1Icon sx={{ fontSize: 35 }} />
			</div>
			<div className="float-left m-4 ml-3 cursor-pointer">
				<Filter2Icon sx={{ fontSize: 35 }} />
			</div>
			<div className="float-left m-4 ml-3 cursor-pointer">
				<Filter3Icon sx={{ fontSize: 35 }} />
			</div>
			<div className="float-left m-4 ml-3 cursor-pointer">
				<Filter4Icon sx={{ fontSize: 35 }} />
			</div>
			<div className="float-left m-4 ml-3 cursor-pointer">
				<Filter5Icon sx={{ fontSize: 35 }} />
			</div>
			<div className="float-left m-4 ml-3 cursor-pointer">
				<Filter6Icon sx={{ fontSize: 35 }} />
			</div>
			<div className="float-left m-4 ml-3 cursor-pointer">
				<Filter7Icon sx={{ fontSize: 35 }} />
			</div>
			<div className="float-left m-4 ml-3 cursor-pointer">
				<Filter8Icon sx={{ fontSize: 35 }} />
				{/* <img src={Skull} alt="logo" className="h-12 w-12" /> */}
			</div>

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

				<div className="float-left w-1/4 text-center cursor-pointer pl-7 mt-2">
					<FlipCameraIosIcon sx={{ fontSize: 35 }} />
				</div>
			</div>
		</div>
	);
}
