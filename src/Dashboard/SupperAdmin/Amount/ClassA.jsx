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
        className="border-2 p-2 rounded-3xl hover:bg-gray-300"
      >
        <p className="text-3xl font-bold">50 Units</p>
        Class A
      </div>
    </>
  );
}
