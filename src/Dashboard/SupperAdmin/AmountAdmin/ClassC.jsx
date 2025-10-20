import React, { useState } from "react";
import DetailClassC from "../DetailsAdmin/DetailClassC";

export default function ClassC() {
  const [isDetailsClassC, setIsDetailsClassC] = useState(false);
  return (
    <>
      {isDetailsClassC && (
        <DetailClassC setIsDetailsClassC={setIsDetailsClassC} />
      )}
      <div onClick={() => setIsDetailsClassC(true)}>
        <p className="text-3xl font-bold">20 Units</p> Class{" "}
        <span className="font-bold text-xl">C</span>
      </div>
    </>
  );
}
