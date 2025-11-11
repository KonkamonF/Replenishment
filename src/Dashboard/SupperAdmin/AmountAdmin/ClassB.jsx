import React, { useState } from "react";
import { useProductTotalByClass } from "../hooks/useProductTotalByClass";
import DetailClassB from "../DetailsAdmin/DetailClassB";

export default function ClassB() {
  const [isDetailsClassB, setIsDetailsClassB] = useState(false);
  const { total, loading, error } = useProductTotalByClass({
    classType: "manual",
    className: "B",
  });

  return (
    <>
      {isDetailsClassB && (
        <DetailClassB setIsDetailsClassB={setIsDetailsClassB} />
      )}
      <div
      className="flex justify-center items-center flex-col"
        onClick={() => setIsDetailsClassB(true)}
      >
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="text-xl font-bold">{total} Units</p>
            <span className="text-sm">Class B</span>
          </>
        )}
      </div>
    </>
  );
}
