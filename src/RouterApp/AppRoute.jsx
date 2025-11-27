import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SupperAdmin from "../SupperAdmin/SupperAdmin";
import TradeAdmin from "../TradeAdmin/TradeAdmin";
import KeyAdmin from "../KeyAdmin/KeyAdmin";
import KeyFC from "../KeyAdmin/KeyFC";
import Appp from "../Appp";
import Login from "../Auth/Login";

import ProtectedRoute from "../Auth/ProtectedRoute";
import RoleGuard from "../Auth/RoleGuard";
import Tradeshipping from "../TradeAdmin/Tradeshipping";

const route = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Appp />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <RoleGuard allowedRoles={["SuperAdmin", "TradeAdmin", "KeyAc"]}>
            <SupperAdmin />
          </RoleGuard>
        ),
      },
      {
        path: "super-admin",
        element: (
          <RoleGuard allowedRoles={["SuperAdmin", "TradeAdmin", "KeyAc"]}>
            <SupperAdmin />
          </RoleGuard>
        ),
      },
      {
        path: "trade-admin",
        element: (
          <RoleGuard allowedRoles={["SuperAdmin", "TradeAdmin"]}>
            <TradeAdmin />
          </RoleGuard>
        ),
      },
      {
        path: "trade-shipping",
        element: (
          <RoleGuard allowedRoles={["SuperAdmin", "TradeAdmin"]}>
            <Tradeshipping/>
          </RoleGuard>
        ),
      },
      {
        path: "key-admin",
        element: (
          <RoleGuard allowedRoles={["SuperAdmin", "KeyAc"]}>
            <KeyAdmin />
          </RoleGuard>
        ),
      },
      {
        path: "key-fc",
        element: (
          <RoleGuard allowedRoles={["SuperAdmin", "KeyAc"]}>
            <KeyFC />
          </RoleGuard>
        ),
      },
    ],
  },
]);

export default function AppRoute() {
  return <RouterProvider router={route} />;
}
