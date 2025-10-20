import React, { useState } from "react";
import DetailClassA from "../DetailsAdmin/DetailClassA";

export default function ClassA() {
  const [isDetailsClassA, setIsDetailsClassA] = useState(false);
  return (
    <>
      {isDetailsClassA && (
        <DetailClassA setIsDetailsClassA={setIsDetailsClassA} />
      )}
      <div
        onClick={() => setIsDetailsClassA(true)}>
        <p className="text-3xl font-bold">50 Units</p>
        Class <span className="font-bold text-xl">A</span> 
      </div>
    </>
  );
}
