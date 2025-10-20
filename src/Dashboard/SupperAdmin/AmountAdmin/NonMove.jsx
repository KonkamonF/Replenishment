import React, { useState } from "react";
import DetailNonMove from "../DetailsAdmin/DetailNonMove";

export default function NonMove() {
  const [isDetailsNonMove, setIsDetailsNonMove] = useState(false);
  return (
    <>
      {isDetailsNonMove && (
        <DetailNonMove setIsDetailsNonMove={setIsDetailsNonMove} />
      )}
      <div onClick={() => setIsDetailsNonMove(true)}>
        <p className="text-3xl font-bold">1 Units</p>
        <span className="font-bold text-lg">Non-Move</span>
      </div>
    </>
  );
}
