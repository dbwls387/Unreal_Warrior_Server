import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function PlayerDetail(props) {
	const [list, setList] = useState([]);
	const [detail, setDetail] = useState();
	const id = props.playerId.substr(6);

	useEffect(() => {
		axios
			.post("https://k8e202.p.ssafy.io/api/showPlayer", {
				playerNumber: id,
			})
			.then(res => {
				// setDetail(res);
				console.log(res);
			})
			.catch(function (err) {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		let copy = [...list];
		let detailCopy = [...detail];

		const socket = io("https://k8e202.p.ssafy.io", {
			path: "/socket.io",
			cors: {
				origin: "*",
				credentials: true,
			},
		});

		socket.on("direction", data => {
			// console.log(data);
			copy = data.indi;
			setList(copy);
		});

		socket.on("actor_status", data => {
			console.log(data.data);
			data.data?.map(p => {
				if (p.playerName === props.playerId) {
					detailCopy = p;
					setDetail(detailCopy);
					console.log(detail);
				}
			});
		});
	}, []);

	useEffect(() => {
		// console.log(detail);
	}, [detail]);

	return (
		<div>
			<div className="w-full h-[100px] mt-5 border-4 border-slate-500 rounded-lg">
				<table table className="table-auto w-full">
					<thead className="bg-slate-500">
						<tr>
							<th
								scope="col"
								className="px-3 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
							>
								플레이어 명
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
							>
								위치
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
							>
								hp
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						<tr>
							<th scope="row" className="px-4 py-3 whitespace-nowrap">
								{props.playerId}
							</th>
							<td className="px-4 py-3 whitespace-nowrap"></td>
							<td className="px-4 py-3 whitespace-nowrap"></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="w-full h-[330px] mt-5 border-4 border-slate-500 rounded-lg">
				<table table className="table-auto w-full">
					<thead className="bg-slate-500">
						<tr>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
							>
								위치
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
							>
								승률
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
							>
								이동
							</th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	);
}
