import React, { useState } from "react";
import DetailNonMove from "../DetailsAdmin/DetailNonMove";

export default function NonMove() {
  const [isDetailsNonMove, setIsDetailsNonMove] = useState(false);
  return (
    <>
      {isDetailsNonMove && (
        <DetailNonMove setIsDetailsNonMove={setIsDetailsNonMove} />
      )}
      <div
        onClick={() => setIsDetailsNonMove(true)}
        className="border-2 p-2 rounded-3xl hover:bg-gray-300"
      >
        <p className="text-3xl font-bold">1 Units</p>Non-Move
      </div>
    </>
  );
}
