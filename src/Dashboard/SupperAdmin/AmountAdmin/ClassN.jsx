import React, { useState } from "react";
import DetailClassN from "../DetailsAdmin/DetailClassN";

export default function ClassN() {
  const [isDetailsClassN, setIsDetailsClassN] = useState(false);
  return (
    <>
      {isDetailsClassN && (
        <DetailClassN setIsDetailsClassN={setIsDetailsClassN} />
      )}
      <div onClick={() => setIsDetailsClassN(true)}>
        <p className="text-3xl font-bold">2 Units</p> Class{" "}
        <span className="font-bold text-xl">N</span>
      </div>
    </>
  );
}
