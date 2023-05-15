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
import GameStatusComponent from "../Components/GameStatusComponent";

export default function Main(props) {
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
					// console.log("@".repeat(30));
					// console.dir(refPlayer.current);
					// console.dir(global);
					// console.dir(stream);
					// console.dir(actions);
				}}
				psHost="ws://127.0.0.1:80"
				// psHost="wss://k8e202.p.ssafy.io"
				psConfig={{
					autoPlay: true,
					autoConnect: true,
					startMuted: true,
					hoveringMouse: true,
					fakeMouseWithTouches: true,
					matchViewportRes: true,
				}}
			>
				{/* <Button onClick={() => actions.emitUi({ action: "ui_command" })}>
					Send action
				</Button> */}
			</MetaEditor>
		);
	};

	return (
		<div className="main">
			<div className="h-3/4 relative">
				<MetaProvider>
					<PlayerView />
				</MetaProvider>
			</div>

			<div className="h-1/4 text-black z-[9999999] bg-white pt-4">
				<div className="status">
					<GameStatusComponent socket={props.socket} />
				</div>
			</div>
		</div>
	);
}
