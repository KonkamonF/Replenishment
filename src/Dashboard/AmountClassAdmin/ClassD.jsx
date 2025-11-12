import React, { useState } from "react";
import { useProductTotalByClass } from "../../hooks/useProductTotalByClass.js";
import DetailClassD from "../DetailsAdmin/DetailClassD.jsx";

export default function ClassD() {
  const [isDetailsClassD, setIsDetailsClassD] = useState(false);
  const { total, loading, error } = useProductTotalByClass({
    classType: "manual",
    className: "C",
  });

  return (
    <>
      {isDetailsClassD && (
        <DetailClassD setIsDetailsClassD={setIsDetailsClassD} />
      )}
      <div
        className="flex justify-center items-center flex-col"
        onClick={() => setIsDetailsClassD(true)}
      >
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="text-xl font-bold">{total} Units</p>
            <span className="text-sm">Class C</span>
          </>
        )}
      </div>
    </>
  );
}
