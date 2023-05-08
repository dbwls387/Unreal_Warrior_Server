import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function PlayerListComponent() {
	const [list, setList] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		let copy = [...list];

		const socket = io("https://k8e202.p.ssafy.io", {
			path: "/socket.io",
			cors: {
				origin: "*",
				credentials: true,
			},

			// transports: ["websocket"],
		});

		socket.on("actor_status", data => {
			copy = data.data;
			setList(copy);
		});
	}, []);

	return (
		<div className="w-full h-[450px] mt-5 border-4 border-slate-500 rounded-lg">
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
				{list.map(player => {
					const location = "(" + player.x + ", " + player.y + ")";

					return (
						<>
							{player.actorName.includes("player") && (
								<tbody
									key={player.actorName}
									className="bg-white divide-y divide-gray-200 cursor-pointer"
									onClick={() => {
										navigate(`/detail/${player.actorName}`);
									}}
								>
									<tr>
										<th scope="row" className="px-4 py-3 whitespace-nowrap">
											{player.actorName}
										</th>
										<td className="px-4 py-3 whitespace-nowrap">{location}</td>
										<td className="px-4 py-3 whitespace-nowrap">{player.hp}</td>
									</tr>
								</tbody>
							)}
						</>
					);
				})}
			</table>
		</div>
	);
}
