import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import SupperAdmin from "../Dashboard/SupperAdmin/SupperAdmin";
import TradeAdmin from "../Dashboard/TradeAdmin/TradeAdmin";
import KeyAdmin from "../Dashboard/KeyAdmin/KeyAdmin";
import Appp from "../Appp";
import KeyFC from "../Dashboard/KeyAdmin/KeyFC";
// import Login from "../SideBar/Login";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Appp />,
    children: [
      { index: true, element: <SupperAdmin /> },
      { path: "super-admin", element: <SupperAdmin /> },
      { path: "trade-admin", element: <TradeAdmin /> },
      { path: "key-admin", element: <KeyAdmin /> },
      { path: "key-fc", element: <KeyFC /> },
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
