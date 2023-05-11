import "./Main.css";
import React from "react";
import PlayerListComponent from "../Components/PlayerListCompoent";
import ProgressbarComponent from "../Components/ProgressbarComponent";
import UnrealComponent from "../Components/UnrealComponent";
import { useParams } from "react-router-dom";
import PlayerDetail from "../Components/PlayerDetail";
// import FileSaver from "file-saver"
import unreal from "../unreal/aiAvatarTest.exe";

import { ButtonGroup, Button } from "rsuite";
import { MetaProvider, MetaEditor, Hooks, Context } from "pixel-streaming";

export default function Main() {
	const { playerId } = useParams();

	// const downLoadUnreal = async (e) => {
	// 	let filename = 'aiAvatarTest.exe'
	// 	// let unrealBlob = exe(unreal).toBlob()
	// 	// let exe = new Blob(unreal, {type})
	// 	const exe = new Blob([unreal])
	// 	FileSaver.saveAs(exe, filename)
	// }

	const PlayerView = () => {
		const refPlayer = React.useRef(null);

		// context
		const global = Context.global();
		const stream = Context.stream();

		// hooks
		const actions = Hooks.actions();

		return (
			<MetaEditor
				ref={refPlayer}
				debugMode="on"
				showToolbar={true}
				onLoad={() => {
					console.log("@".repeat(30));
					console.dir(refPlayer.current);
					console.dir(global);
					console.dir(stream);
					console.dir(actions);
				}}
				psHost="ws://221.141.159.166:80"
				psConfig={{
					autoPlay: true,
					autoConnect: true,
					startMuted: true,
					hoveringMouse: true,
					fakeMouseWithTouches: true,
					matchViewportRes: true,
				}}
			>
				<Button onClick={() => actions.emitUi({ action: "ui_command" })}>
					Send action
				</Button>
			</MetaEditor>
		);
	};

	return (
		<div className="main">
			{/* <div className="left">
				<ProgressbarComponent />

				플레이어 전체보기
				{playerId === undefined && <PlayerListComponent />}
				{playerId != undefined && <PlayerDetail playerId={playerId} />}
			</div>

			<div className="right">
				<button className="download" onClick={downLoadUnreal}>DownLoad</button>
				<UnrealComponent />
				<a href="http://naver.me/xM8yCjI7">Download2</a>
			</div> */}

			<MetaProvider>
				<PlayerView />
			</MetaProvider>
		</div>
	);
}
