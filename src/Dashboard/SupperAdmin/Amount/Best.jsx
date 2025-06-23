import React, { useState } from "react";
import DetailBest from "../Details/DetailBest";

export default function Best() {
  const [isDetailsBest, setIsDetailsBest] = useState(false);
  return (
    <>
      {isDetailsBest && <DetailBest setIsDetailsBest={setIsDetailsBest} />}
      <div
        onClick={() => setIsDetailsBest(true)}
        className="border-2 p-2 rounded-3xl hover:bg-gray-200 cursor-pointer"
      >
        <p className="text-3xl font-bold">11 Units</p>Best
      </div>
    </>
  );
}
