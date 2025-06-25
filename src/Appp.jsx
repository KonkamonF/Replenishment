import Side from "./Side/Side";
import { Outlet } from "react-router-dom";


export default function Appp() {
  return (
    <>
      <div className="bg-gray-100">
        <div className="bg-white h-[64px]">head</div>
        <div className="flex">
          <div className="h-screen bg-white w-[200px]">
            <Side />
          </div>
          <div className="p-6 w-screen">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
