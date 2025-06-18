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
    <div className="bg-white text-white h-screen flex flex-col p-4 space-y-4 text-center">
      <div className="flex gap-4">
        <div className="w-[50%]">
          <ClassA />
        </div>
        <div className="w-[50%]">
          <ClassB />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-[50%]">
          <ClassC />
        </div>
        <div className="w-[50%]">
          <ClassN />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-[50%]">
          <Best />
        </div>
        <div className="w-[50%]">
          <NonMove />
        </div>
      </div>
      <AcAndFc />
    </div>
  );
}
