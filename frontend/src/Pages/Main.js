import React from "react";
import PlayerListComponent from "../Components/PlayerListCompoent";
import ProgressbarComponent from "../Components/ProgressbarComponent";
import UnrealComponent from "../Components/UnrealComponent";
import "./Main.css";

export default function Main() {
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
