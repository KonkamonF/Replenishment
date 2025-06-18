import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import SupperAdmin from "../Dashboard/SupperAdmin/SupperAdmin";
import TradeAdmin from "../Dashboard/TradeAdmin/TradeAdmin";
import KeyAdmin from "../Dashboard/KeyAdmin/KeyAdmin";
import Appp from "../Appp";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Appp />,
    children: [
      { index: true, element: <SupperAdmin /> },
      { path: "trade-admin", element: <TradeAdmin /> },
      { path: "key-admin", element: <KeyAdmin /> },
    ],
  },
]);

export default function AppRoute() {
  return (
    <div>
      <RouterProvider router={route} />
    </div>
  );
}
