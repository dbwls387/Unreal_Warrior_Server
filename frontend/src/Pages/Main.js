import "./Main.css";
import React from "react";
import PlayerListComponent from "../Components/PlayerListCompoent";
import ProgressbarComponent from "../Components/ProgressbarComponent";
import UnrealComponent from "../Components/UnrealComponent";
import { useParams } from "react-router-dom";
import PlayerDetail from "../Components/PlayerDetail";

export default function Main() {
	const { playerId } = useParams();

	return (
		<div className="main">
			<div className="left">
				<ProgressbarComponent />

				{/* 플레이어 전체보기 */}
				{playerId === undefined && <PlayerListComponent />}
				{playerId != undefined && <PlayerDetail playerId={playerId} />}
			</div>

			<div className="right">
				<UnrealComponent />
			</div>
		</div>
	);
}
