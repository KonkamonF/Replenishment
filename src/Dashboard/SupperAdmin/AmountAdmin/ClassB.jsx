import React, { useState } from "react";
import DetailClassB from "../DetailsAdmin/DetailClassB";

export default function ClassB() {
  const [isDetailsClassB, setIsDetailsClassB] = useState(false);
  return (
    <>
      {isDetailsClassB && (
        <DetailClassB setIsDetailsClassB={setIsDetailsClassB} />
      )}

      <div
        onClick={() => setIsDetailsClassB(true)}
      >
        <p className="text-3xl font-bold">60 Units</p>Class B
      </div>
    </>
  );
}
