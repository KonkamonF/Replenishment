import React from "react";
import SupperAdmin from "./Dashboard/SupperAdmin/SupperAdmin";
import Side from "./Side/Side";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <div className="bg-gray-50">
        <div className="h-[64px] bg-white">head</div>
        <div className="flex">
          <div className="h-screen bg-white w-[200px]">
            <Side/>
          </div>
          <div className="mx-auto p-6">
            <Outlet/>
          </div>
        </div>
      </div>
    </>
  );
}
