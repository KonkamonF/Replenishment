import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SupperAdmin from "../Dashboard/SupperAdmin/SupperAdmin";
import TradeAdmin from "../Dashboard/TradeAdmin/TradeAdmin";
import KeyAdmin from "../Dashboard/KeyAdmin/KeyAdmin";

const route = createBrowserRouter([
  {
    path: "/",
    element: <SupperAdmin />,
    children: [
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
