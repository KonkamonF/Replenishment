import React, { useState } from "react";
import DetailNonMove from "../Details/DetailNonMove";

export default function NonMove() {
  const [isDetailsNonMove, setIsDetailsNonMove] = useState(false);
  return (
    <>
      {isDetailsNonMove && (
        <DetailNonMove setIsDetailsNonMove={setIsDetailsNonMove} />
      )}
      <div
        onClick={() => setIsDetailsNonMove(true)}
        className="border-2 bg-[#640037] p-2 rounded-3xl w-[40%] hover:bg-gray-500"
      >
        <p className="text-3xl font-bold">1 Units</p>Non-Move
      </div>
    </>
  );
}
