import React from "react";
import ClassA from "./Amount/ClassA";
import ClassB from "./Amount/ClassB";
import ClassC from "./Amount/ClassC";
import ClassN from "./Amount/ClassN";
import Best from "./Amount/Best";
import NonMove from "./Amount/Nonmove";
import AcAndFc from "./Amount/AcAndFc";

export default function SupperAdmin() {
  return (
    <div className="bg-white text-white h-screen flex text-center">
      <div className="flex flex-col p-4 space-y-4 text-center">
        <div className="flex gap-4">
          <div className="w-[20%]">
            <ClassA />
          </div>
          <div className="w-[20%]">
            <ClassB />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[20%]">
            <ClassC />
          </div>
          <div className="w-[20%]">
            <ClassN />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[20%]">
            <Best />
          </div>
          <div className="w-[20%]">
            <NonMove />
          </div>
        </div>
      </div>

      <AcAndFc />
    </div>
  );
}
