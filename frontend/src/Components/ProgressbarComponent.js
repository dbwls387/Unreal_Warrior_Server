import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function ProgressbarComponent() {
	const [list, setList] = useState([]);

	useEffect(() => {
		let copy = [...list];

		const socket = io("https://k8e202.p.ssafy.io", {
			path: "/socket.io",
			// transports: ["websocket"],
		});

		socket.on("win_rate", data => {
			copy = data;
			setList(copy);
		});
	}, []);

	useEffect(() => {
		// console.log(list);
	}, [list]);

	return (
		<div className="progress w-full h-24 bg-slate-200">
			승률 progress bar로 만들기...
			<div>패: {list[0]}</div>
			<div>승: {list[1]}</div>
			<div>무: {list[2]}</div>
		</div>
	);
}
