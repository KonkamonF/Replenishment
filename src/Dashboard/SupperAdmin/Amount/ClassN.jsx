import React, { useState } from "react";
import DetailClassN from "../Details/DetailClassN";

export default function ClassN() {
  const [isDetailsClassN, setIsDetailsClassN] = useState(false);
  return (
    <>
      {isDetailsClassN && (
        <DetailClassN setIsDetailsClassN={setIsDetailsClassN} />
      )}
      <div
        onClick={() => setIsDetailsClassN(true)}
        className="border-2 p-2 rounded-3xl hover:bg-gray-500"
      >
        <p className="text-3xl font-bold">2 Units</p>Class N
      </div>
    </>
  );
}
