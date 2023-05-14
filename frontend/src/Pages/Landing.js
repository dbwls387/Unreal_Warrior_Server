import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

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
		// navigate("/unreal", { socket: 1 });

		socket.emit("unreal_socket_id", id);
		socket.on("connect_unreal", data => {
			if (data) {
				navigate("/unreal", { state: { socket: socket } });
			} else {
				localStorage.removeItem("socketId");
				alert("다시 입력해주세요. ");
			}
		});
	}

	return (
		<>
			<section className="text-gray-700 body-font">
				<div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
					<div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
						<h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
							Before they sold out
							{/* <br className="hidden lg:inline-block">readymade gluten </br> */}
						</h1>
						<p className="mb-8 leading-relaxed">
							Copper mug try-hard pitchfork pour-over freegan heirloom neutra
							air plant cold-pressed tacos poke beard tote bag. Heirloom echo
							park mlkshk tote bag selvage hot chicken authentic tumeric
							truffaut hexagon try-hard chambray.
						</p>
						<div className="flex justify-center">
							<button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
								Button
							</button>
							<button className="ml-4 inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg">
								Button
							</button>
						</div>
					</div>
					<div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
						<img
							className="object-cover object-center rounded"
							alt="hero"
							src="https://dummyimage.com/720x600/edf2f7/a5afbd"
						/>
					</div>
				</div>
			</section>
			<section className="text-gray-700 body-font border-t border-gray-200">
				<div className="container px-5 py-24 mx-auto">
					<div className="container h-50 flex justify-center items-center">
						<div className="relative">
							<div className="absolute top-4 left-3">
								<i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>
							</div>
							<input
								type="text"
								className="h-14 w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none border"
								placeholder="id를 입력해주세요. "
								value={id}
								onChange={e => {
									setId(e.target.value);
								}}
							/>
							<div className="absolute top-2 right-2">
								<button
									className="h-10 w-20 text-white rounded-lg bg-sky-500 hover:bg-sky-700"
									onClick={onSubmit}
								>
									입장
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
