import React from 'react';
import PlayerListComponent from '../Components/PlayerListCompoent';
import ProgressbarComponent from '../Components/ProgressbarComponent';
import UnrealComponent from '../Components/UnrealComponent';
import './Main.css';
import { io } from 'socket.io-client';

export default function Main() {
	const socket = io('https://k8e202.p.ssafy.io', {
		path: '/socket.io',
		// transports: ["websocket"],
	});

	socket.on('win_rate', data => console.log(data));

	// socket.on('hi', data => console.log(data)); // 서버 -> 클라이언트

	return (
		<div className="main">
			<div className="left">
				<ProgressbarComponent />
				<PlayerListComponent />
			</div>

			<div className="right">
				<UnrealComponent />
			</div>
		</div>
	);
}
