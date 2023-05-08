import { createBrowserRouter } from "react-router-dom";
import Main from "../Pages/Main";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Main />,
		// errorElement: <NotFound />,
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
