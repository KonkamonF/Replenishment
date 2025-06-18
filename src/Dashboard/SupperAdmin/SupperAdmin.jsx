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
    <div className="bg-white text-[#640037] h-screen flex flex-col text-center">
      <div className="flex gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex gap-8">
            <div className="w-[200px]">
              <ClassA />
            </div>
            <div className="w-[200px]">
              <ClassB />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="w-[200px]">
              <ClassC />
            </div>
            <div className="w-[200px]">
              <ClassN />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="w-[200px]">
              <Best />
            </div>
            <div className="w-[200px]">
              <NonMove />
            </div>
          </div>
        </div>
        <AcAndFc />
      </div>
    </div>
  );
}
