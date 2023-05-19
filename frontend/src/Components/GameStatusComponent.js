import React, { useState } from "react";
import { io } from "socket.io-client";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function GameStatusComponent(props) {
	const macAddress = localStorage.getItem("macAddress");

	const [cam, setCam] = useState("map");
	const [team, setTeam] = useState("player");
	const changeTeam = (event, newTeam) => {
		if (newTeam === "player") onChoicePlayer(-1);
		else onChoicePlayer(-2);
	};

	const socket = io("https://k8e202.p.ssafy.io", {
		path: "/socket.io",
		cors: {
			origin: "*",
			credentials: true,
		},
	});

	socket.on("disconnect", socket => {
		console.log("disconnected react");
	});

	function onSocket(state) {
		const data = {
			macAddress: macAddress,
			control: state,
		};
		socket.emit("sim_control", data);
	}

	function onCameraSocket(state) {
		const data = {
			macAddress: macAddress,
			camera: state ? 1 : 0,
		};
		socket.emit("camera_control", data);
	}

	function onChoicePlayer(player) {
		const data = {
			macAddress: macAddress,
			playerNumber: player,
			mainViewport: player < 0 ? 0 : 1,
			team: player === -1 ? 0 : 1,
		};

		socket.emit("choice_player_react", data);
	}

	const theme = createTheme({
		palette: {
			primary: {
				main: "#374151",
			},
			success: {
				main: "#374151",
			},
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<div className="h-32 p-2 w-full ">
				{/* 플레이어 선택 */}
				<ButtonGroup
					variant="outlined"
					aria-label="outlined button group"
					className="mx-8 mt-4"
					size="large"
					color="primary"
				>
					<Button
						onClick={() => {
							onChoicePlayer(0);
						}}
					>
						1
					</Button>
					<Button
						onClick={() => {
							onChoicePlayer(1);
						}}
					>
						2
					</Button>
					<Button
						onClick={() => {
							onChoicePlayer(2);
						}}
					>
						3
					</Button>
					<Button
						onClick={() => {
							onChoicePlayer(3);
						}}
					>
						4
					</Button>
					<Button
						onClick={() => {
							onChoicePlayer(4);
						}}
					>
						5
					</Button>
					<Button
						onClick={() => {
							onChoicePlayer(5);
						}}
					>
						6
					</Button>
					<Button
						onClick={() => {
							onChoicePlayer(6);
						}}
					>
						7
					</Button>
					<Button
						onClick={() => {
							onChoicePlayer(7);
						}}
					>
						8
					</Button>
				</ButtonGroup>

				{/* 카메라, 맵 전환 */}
				<ToggleButtonGroup
					color="primary"
					size="small"
					value={team}
					exclusive
					onChange={changeTeam}
					aria-label="Platform"
				>
					<ToggleButton
						value="player"
						onClick={() => {
							setTeam("player");
						}}
					>
						우리 팀
					</ToggleButton>
					<ToggleButton
						value="enemy"
						onClick={() => {
							setTeam("enemy");
						}}
					>
						상대 팀
					</ToggleButton>
				</ToggleButtonGroup>

				<ToggleButtonGroup
					color="primary"
					size="small"
					value={cam}
					exclusive
					// onChange={changeCam}
					aria-label="Platform"
					className="mx-8 mt-4"
				>
					<ToggleButton
						value="map"
						onClick={() => {
							setCam("map");
							onCameraSocket(false);
						}}
					>
						전체 맵
					</ToggleButton>
					<ToggleButton
						value="character"
						onClick={() => {
							setCam("character");
							onCameraSocket(true);
						}}
					>
						캐릭터 화면
					</ToggleButton>
				</ToggleButtonGroup>

				{/* 일시정지, 재생 */}
				<div className="float-right w-48 mt-4 mr-4">
					<div
						className="float-left w-1/3 text-center cursor-pointer"
						onClick={() => {
							onSocket("pause");
						}}
					>
						<PauseCircleOutlineIcon sx={{ fontSize: 43 }} color="success" />
					</div>
					<div
						className="float-left w-1/3 text-center cursor-pointer"
						onClick={() => {
							onSocket("play");
						}}
					>
						<PlayCircleOutlineIcon sx={{ fontSize: 43 }} color="success" />
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
}
