import React, { useState } from "react";
import { useProductTotalByClass } from "../../hooks/useProductTotalByClass.js";
import DetailClassMD from "../DetailsAdmin/DetailClassMD.jsx";

export default function ClassMD() {
  const [isDetailsClassMD, setIsDetailsClassMD] = useState(false);
  const { total, loading, error } = useProductTotalByClass({
    classType: "manual",
    className: "C",
  });

  return (
    <>
      {isDetailsClassMD && (
        <DetailClassMD setIsDetailsClassMD={setIsDetailsClassMD} />
      )}
      <div
        className="flex justify-center items-center flex-col"
        onClick={() => setIsDetailsClassMD(true)}
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
