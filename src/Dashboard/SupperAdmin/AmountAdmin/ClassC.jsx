import React, { useState } from "react";
import { useProductTotalByClass } from "../hooks/useProductTotalByClass";
import DetailClassC from "../DetailsAdmin/DetailClassC";

export default function ClassC() {
  const [isDetailsClassC, setIsDetailsClassC] = useState(false);
  const { total, loading, error } = useProductTotalByClass({
    classType: "manual",
    className: "C",
  });

  return (
    <>
      {isDetailsClassC && (
        <DetailClassC setIsDetailsClassC={setIsDetailsClassC} />
      )}
      <div
        onClick={() => setIsDetailsClassC(true)}
      >
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="text-3xl font-bold">{total} Units</p>
            <span className="font-bold text-lg">C</span>
          </>
        )}
      </div>
    </>
  );
}
