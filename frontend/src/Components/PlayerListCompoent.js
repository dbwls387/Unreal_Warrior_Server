import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function PlayerListComponent() {
	const [list, setList] = useState([]);

	useEffect(() => {
		const socket = io("https://k8e202.p.ssafy.io", {
			path: "/socket.io",
			// transports: ["websocket"],
		});

		socket.on("actor_status", data => {
			console.log("data: ", data.data);
			setList(data.data);
			console.log("onList: ", list);
		});

		console.log("list: ", list);
	}, []);

	useEffect(() => {
		console.log(list);
	}, [list]);

	return (
		<div className="w-full h-[450px] mt-5 border-4 border-slate-500 rounded-lg">
			<table className="table w-full">
				<thead>
					<tr>
						<th scope="col">플레이어 명</th>
						<th scope="col">위치</th>
						<th scope="col">hp</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">player1</th>
						<td>(142, 254, 356)</td>
						<td>100</td>
					</tr>
					<tr>
						<th scope="row">player2</th>
						<td>(142, 254, 356)</td>
						<td>80</td>
					</tr>
					<tr>
						<th scope="row">player3</th>
						<td>(142, 254, 356)</td>
						<td>60</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
