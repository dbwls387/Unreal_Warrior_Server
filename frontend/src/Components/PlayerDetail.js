import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function PlayerDetail(props) {
	const [list, setList] = useState([]);
	const [detail, setDetail] = useState([]);
	const id = props.playerId.substr(6);

	// axios
	// useEffect(() => {
	// 	axios
	// 		.post("https://k8e202.p.ssafy.io/api/showPlayer", {
	// 			playerNumber: id,
	// 		})
	// 		.then(res => {
	// 			// console.log(res);
	// 		})
	// 		.catch(function (err) {
	// 			console.log(err);
	// 		});
	// }, []);

	// socket on
	// useEffect(() => {
	// 	let copy = [...list];
	// 	let detailCopy = [...detail];

	// 	const socket = io("https://k8e202.p.ssafy.io", {
	// 		path: "/socket.io",
	// 		cors: {
	// 			origin: "*",
	// 			credentials: true,
	// 		},
	// 	});

	// 	socket.on("direction", data => {
	// 		copy = data.indi;
	// 		setList(copy);
	// 	});

	// 	socket.on("actor_status", data => {
	// 		data.data?.map(p => {
	// 			if (p.actorName === props.playerId) {
	// 				detailCopy[0] = p.x;
	// 				detailCopy[1] = p.y;
	// 				detailCopy[2] = p.hp;
	// 				setDetail(detailCopy);
	// 			}
	// 		});
	// 	});
	// }, []);

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
								현재 위치
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
							<td className="px-4 py-3 whitespace-nowrap">
								({detail[0]}, {detail[1]})
							</td>
							<td className="px-4 py-3 whitespace-nowrap">{detail[2]}</td>
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
						</tr>
					</thead>

					{list.map(dir => {
						return (
							<tbody key={dir.nx} className="bg-white divide-y divide-gray-200">
								<tr>
									<td className="px-4 py-3 whitespace-nowrap">
										({Math.floor(dir.nx * 10) / 10.0},{" "}
										{Math.floor(dir.ny * 10) / 10.0})
									</td>
									<td className="px-4 py-3 whitespace-nowrap">
										{Math.round(dir.win * 10000) / 10000.0} %
									</td>
								</tr>
							</tbody>
						);
					})}
				</table>
			</div>
		</div>
	);
}
