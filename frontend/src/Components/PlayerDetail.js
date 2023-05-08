import axios from "axios";
import { useEffect, useState } from "react";

export default function PlayerDetail(props) {
	const [detail, setDetail] = useState([]);
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
