import React from "react";
import ClassA from "./AmountAdmin/ClassA";
import ClassB from "./AmountAdmin/ClassB";
import ClassC from "./AmountAdmin/ClassC";
import ClassN from "./AmountAdmin/ClassN";
import Best from "./AmountAdmin/Best";
import NonMove from "./AmountAdmin/NonMove";
import AcAndFc from "./AmountAdmin/AcAndFc";

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
