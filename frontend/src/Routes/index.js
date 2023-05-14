import { createBrowserRouter } from "react-router-dom";
import Landing from "../Pages/Landing";
import Main from "../Pages/Main";

const router = createBrowserRouter([
	{
		path: "/",
		// element: <Main />,
		element: <Landing />,
		// errorElement: <NotFound />,
	},
	{
		path: "/",
		children: [
			{
				path: "",
				// 언리얼 화면 입장
				children: [{ path: "/urneal", element: <Main /> }],
			},
		],
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
