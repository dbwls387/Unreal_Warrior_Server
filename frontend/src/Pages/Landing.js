import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

export default function Landing() {
	const navigate = useNavigate();
	const [id, setId] = useState("");
	const socket = io("https://k8e202.p.ssafy.io", {
		path: "/socket.io",
		cors: {
			origin: "*",
			credentials: true,
		},
	});

	function onSubmit() {
		localStorage.setItem("socketId", id);
		onSocket(id);
	}
	function onSocket(id) {
		socket.emit("unreal_socket_id", id);
		socket.on("connect_unreal", data => {
			if (data) {
				socket.emit("start_game", id);
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
		<>
			<section className="text-gray-700 body-font pt-20">
				<div className="container mx-auto px-5 py-24 md:flex-row flex-col items-center">
					<div className="flex-col md:items-start mb-0 items-center text-center">
						<h1 className="title-font sm:text-5xl text-3xl mb-4 font-medium text-gray-900">
							Unreal Warrior
						</h1>
						<p className="mb-8 leading-relaxed">
							Copper mug try-hard pitchfork pour-over freegan heirloom neutra
						</p>
						<div className="flex justify-center">
							<button
								className="inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg"
								onClick={() => {
									Swal.fire({
										text: "설명서",
										confirmButtonColor: "#374151", // confrim 버튼 색깔 지정
									});
								}}
							>
								사용 설명
							</button>
							<button
								className="ml-4 inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
								onClick={() => {
									Swal.fire({
										text: "다운로드 링크",
										html: `<div>
                                                http://naver.me/xM8yCjI7
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
		</>
	);
}
