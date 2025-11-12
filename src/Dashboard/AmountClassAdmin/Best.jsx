import React, { useState } from "react";
import DetailBest from "../DetailsAdmin/DetailBest";

export default function Best() {
  const [isDetailsBest, setIsDetailsBest] = useState(false);
  return (
    <>
      {isDetailsBest && <DetailBest setIsDetailsBest={setIsDetailsBest} />}
      <div
        className="flex justify-center items-center flex-col"
        onClick={() => setIsDetailsBest(true)}
      >
        <p className="text-xl font-bold">11 Units</p>
        <span className="text-sm">Best & Best Set</span>
      </div>
    </>
  );
}
