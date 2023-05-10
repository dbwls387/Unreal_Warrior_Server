import "./Main.css";
import React from "react";
import PlayerListComponent from "../Components/PlayerListCompoent";
import ProgressbarComponent from "../Components/ProgressbarComponent";
import UnrealComponent from "../Components/UnrealComponent";
import { useParams } from "react-router-dom";
import PlayerDetail from "../Components/PlayerDetail";
// import FileSaver from "file-saver"
import unreal from "../unreal/aiAvatarTest.exe"

export default function Main() {
	const { playerId } = useParams();

	
	// const downLoadUnreal = async (e) => {
	// 	let filename = 'aiAvatarTest.exe'
	// 	// let unrealBlob = exe(unreal).toBlob()
	// 	// let exe = new Blob(unreal, {type})
	// 	const exe = new Blob([unreal])
	// 	FileSaver.saveAs(exe, filename)
	// }
	return (
		<div className="main">
			<div className="left">
				<ProgressbarComponent />

				{/* 플레이어 전체보기 */}
				{playerId === undefined && <PlayerListComponent />}
				{playerId != undefined && <PlayerDetail playerId={playerId} />}
			</div>

			<div className="right" >
				{/* <button className="download" onClick={downLoadUnreal}>DownLoad</button> */}
				{/* <UnrealComponent /> */}
				<a href="http://naver.me/xM8yCjI7">Download2</a>
			</div>
		</div>
	);
}
