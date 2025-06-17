import React from "react";
import SupperAdmin from "./Dashboard/SupperAdmin/SupperAdmin";
import Side from "./Side/Side";
import { Outlet } from "react-router-dom";
import TradeAdmin from "./Dashboard/TradeAdmin/TradeAdmin";
import KeyAdmin from "./Dashboard/KeyAdmin/KeyAdmin";


export default function App() {
  return (
    <>
      <div className="bg-gray-50">
        <div className="h-[64px] bg-white">head</div>
        <div className="flex">
          <div className="h-screen bg-white w-[200px]">
            <Side/>
          </div>
          <div className="p-6 w-screen">
            <SupperAdmin/>
            <TradeAdmin/>
            <KeyAdmin/>
            {/* <Outlet/> */}
          </div>
        </div>
      </div>
    </>
  );
}
