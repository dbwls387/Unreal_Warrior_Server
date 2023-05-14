import { createBrowserRouter } from "react-router-dom";
import Landing from "../Pages/Landing";
import Main from "../Pages/Main";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Landing />,
		// errorElement: <NotFound />,
	},
	{
		// 언리얼 화면 입장
		path: "/unreal",
		element: <Main />,
	},
	{
		path: "/",
		children: [
			{
				path: "",
				// 플레이어 상세보기
				children: [{ path: "/detail/:playerId", element: <Main /> }],
			},
		],
	},
]);

export default router;
