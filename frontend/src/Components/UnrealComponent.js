import GameStatusComponent from './GameStatusComponent';

export default function UnrealComponent() {
	return (
		<div className="">
			<div className="gameScreen h-[550px] m-4 pt-60 border-4 border-slate-500 rounded-lg text-center">
				언리얼 화면 들어갈 곳
			</div>

			<div className="status">
				<GameStatusComponent />
			</div>
		</div>
	);
}
