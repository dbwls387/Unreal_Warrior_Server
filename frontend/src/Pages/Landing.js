import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import "../Pages/Landing.css";
import logo from "../assets/pinklogo_circle.png";
import dld from "../assets/download.png";
import bgv from "../assets/mbv.mp4";
export default function Landing() {
	const [swalProps, setSwalProps] = useState({});

	const navigate = useNavigate();
	const [id, setId] = useState("");
	const socket = io("https://k8e202.p.ssafy.io", {
		path: "/socket.io",
		cors: {
			origin: "*",
			credentials: true,
		},
	});

	socket.on("disconnect", socket => {
		console.log("disconnected react");
	});

	function handleClick() {
		setSwalProps({
			show: true,
			title: "TESTEST",
		});
	}
	function onSubmit() {
		localStorage.setItem("macAddress", id);
		onSocket(id);
	}
	function onSocket(id) {
		const socketId = {
			id: socket.id,
			mac: id,
		};
		socket.emit("unreal_socket_id", socketId);
		socket.on("connect_unreal", async data => {
			if (data) {
				await socket.emit("join_room", id);
				await socket.emit("start_game", id);

				navigate("/unreal", { state: { socket: socket } });
			} else {
				localStorage.removeItem("socketId");
				Swal.fire({
					text: "존재하지 않는 코드입니다. ",
					icon: "error",
					confirmButtonColor: "#374151", // confrim 버튼 색깔 지정
				});
			}
		});
	}

	return (
		<div
			style={{
				width: "100%",
			}}
		>
			<video
				autoPlay
				loop
				muted
				style={{
					position: "absolute",
					width: "100%",
					left: "50%",
					right: "50%",
					height: "100%",
					objectFit: "cover",
					transform: "translate(-50%)",
					zIndex: -1,
				}}
			>
				<source src={bgv} type="video/mp4" />
			</video>
			<section
				className="text-gray-700 body-font pt-20"
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					// top: "7%",
				}}
			>
				<div className="container mx-auto px-5 py-24 md:flex-row flex-col items-center">
					<div className="flex-col md:items-start mb-0 items-center text-center align-center">
						<img className="main-logo" src={logo} />
						{/* <h1 className="title-font sm:text-5xl text-3xl mb-4 font-medium text-gray-900">
							Unreal Warrior
						</h1> */}
						<p className="mb-8 leading-relaxed text-white">
							Play Unreal Warroir and find the best route for your team.
						</p>
						<div className="flex justify-center">
							<button
								className="inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg"
								onClick={() => {
									Swal.fire({
										title: "<h3>Unreal Warrior 사용방법</h3>",
										html:
											'<p style="color:gray;">Settings</p>' +
											'<p style="color:gray;">⋄ Unreal Engine 5.1</p>' +
											'<p style="color:gray;">⋄ Node.js (LTS)</p><br>' +
											"<b>STEP1</b><br>" +
											"게임을 <strong>다운로드</strong>합니다.<br>" +
											// '<img src="../assets/download.png"></img>'+
											"<br>" +
											"<b>STEP2</b><br>" +
											"<p>아래 경로의 <strong>run.bat</strong>파일을 실행합니다.</p>" +
											'<p style="color:gray;">Windows/UW/Samples/PixelStreaming/WebServers/SignallingWebServer/platform_scripts/cmd/run_local.bat</p><br>' +
											"<b>STEP3</b><br>" +
											"zip파일을 풀고 aiAvatarTest.exe-실행 파일을 실행합니다.<br><br>" +
											"<b>STEP4</b><br>" +
											"<p>게임 시작시 나오는 코드를 브라우저에 입력합니다.</p>" +
											"<p>이제 브라우저에서 화면을 컨트롤 할 수 있습니다!</p>",

										text: "hi",
										confirmButtonColor: "#374151", // confrim 버튼 색깔 지정
									});
								}}
								// onClick={handleClick}
							>
								사용 설명
							</button>

							<button
								className="btn-download ml-4 inline-flex text-white border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
								onClick={() => {
									Swal.fire({
										// text: "다운로드 링크",
										html: `<div>
												<a href="http://naver.me/F2YUOh3O" target='_blank'>[다운로드] 클릭 👆</a>
											</div>`,
										confirmButtonColor: "#374151", // confrim 버튼 색깔 지정
									});
								}}
							>
								다운로드
							</button>
						</div>
					</div>
				</div>

				<div className="container h-50 flex justify-center items-center mx-auto">
					<div className="relative">
						<div className="absolute top-4 left-3">
							<i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>
						</div>
						<input
							type="text"
							className="h-14 w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none border"
							placeholder="코드를 입력해주세요. "
							value={id}
							onChange={e => {
								setId(e.target.value);
							}}
						/>
						<div className="absolute top-2 right-2">
							<button
								className="h-10 w-20 text-white rounded-lg bg-indigo-500 hover:bg-indigo-700"
								onClick={onSubmit}
							>
								입장
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
