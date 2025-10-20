import React, { useState } from "react";
import DetailBest from "../DetailsAdmin/DetailBest";

export default function Best() {
  const [isDetailsBest, setIsDetailsBest] = useState(false);
  return (
    <>
      {isDetailsBest && <DetailBest setIsDetailsBest={setIsDetailsBest} />}
      <div onClick={() => setIsDetailsBest(true)}>
        <p className="text-3xl font-bold">11 Units</p>
        <span className="font-bold text-lg">Best</span>
      </div>
    </>
  );
}
