import React from "react";
import SupperAdmin from "./Dashboard/SupperAdmin/SupperAdmin";
import Side from "./Side/Side";
import { Outlet } from "react-router-dom";
import TradeAdmin from "./Dashboard/TradeAdmin/TradeAdmin";
import KeyAdmin from "./Dashboard/KeyAdmin/KeyAdmin";
import AppRoute from "./RouterApp/AppRoute";

export default function App() {
  return (
    <>
      <AppRoute />
    </>
  );
}
