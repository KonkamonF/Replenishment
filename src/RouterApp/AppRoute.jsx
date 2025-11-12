import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import SupperAdmin from "../SupperAdmin/SupperAdmin";
import TradeAdmin from "../TradeAdmin/TradeAdmin";
import KeyAdmin from "../KeyAdmin/KeyAdmin";
import Appp from "../Appp";
import KeyFC from "../KeyAdmin/KeyFC.jsx";

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
