import React, { useState } from "react";
import DetailClassC from "../Details/DetailClassC";

export default function ClassC() {
  const [isDetailsClassC, setIsDetailsClassC] = useState(false);
  return (
    <>
      {isDetailsClassC && (
        <DetailClassC setIsDetailsClassC={setIsDetailsClassC} />
      )}
      <div
        onClick={() => setIsDetailsClassC(true)}
        className="border-2 p-2 rounded-3xl hover:bg-gray-500"
      >
        <p className="text-3xl font-bold">20 Units</p>Class C
      </div>
    </>
  );
}
