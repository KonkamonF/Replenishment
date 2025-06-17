import React, { useState } from "react";
import DetailClassA from "../Details/DetailClassA";

export default function ClassA() {
  const [isDetailsClassA, setIsDetailsClassA] = useState(false);
  return (
    <>
      {isDetailsClassA && (
        <DetailClassA setIsDetailsClassA={setIsDetailsClassA} />
      )}
      <div
        onClick={() => setIsDetailsClassA(true)}
        className="border-2 bg-[#640037] p-2 rounded-3xl w-[40%] hover:bg-gray-500"
      >
        <p className="text-3xl font-bold">50 Units</p>
        Class A
      </div>
    </>
  );
}
