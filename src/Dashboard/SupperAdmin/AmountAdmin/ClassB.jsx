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
        className="border-2 p-2 rounded-3xl hover:bg-gray-300"
      >
        <p className="text-3xl font-bold">60 Units</p>Class B
      </div>
    </>
  );
}
