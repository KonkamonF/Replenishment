import { createBrowserRouter } from "react-router-dom";
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
