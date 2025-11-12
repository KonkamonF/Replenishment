import React, { useState } from "react";
import DetailNonMove from "../DetailsAdmin/DetailNonMove.jsx";

export default function NonMove() {
  const [isDetailsNonMove, setIsDetailsNonMove] = useState(false);
  return (
    <>
      {isDetailsNonMove && (
        <DetailNonMove setIsDetailsNonMove={setIsDetailsNonMove} />
      )}
      <div
        className="flex justify-center items-center flex-col"
        onClick={() => setIsDetailsNonMove(true)}
      >
        <p className="text-xl font-bold">1 Units</p>
        <span className="text-sm">Non-Move</span>
      </div>
    </>
  );
}
