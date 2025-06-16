import React from "react";
import SupperAdmin from "./Dashboard/SupperAdmin/SupperAdmin";

export default function App() {
  return (
    <>
      <div className="bg-gray-50">
        <div className="h-[64px] bg-white">head</div>
        <div className="flex">
          <div className="h-screen bg-white">
            <p className="w-[200px]">side</p>
          </div>
          <div className="mx-auto p-6">
            <SupperAdmin />
          </div>
        </div>
      </div>
    </>
  );
}
