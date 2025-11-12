import React, { useState } from "react";
import { useProductTotalByClass } from "../../hooks/useProductTotalByClass";
import DetailClassN from "../DetailsAdmin/DetailClassN.jsx";

export default function ClassN() {
  const [isDetailsClassN, setIsDetailsClassN] = useState(false);
  const { total, loading, error } = useProductTotalByClass({
    classType: "manual",
    className: "N",
  });

  return (
    <>
      {isDetailsClassN && (
        <DetailClassN setIsDetailsClassN={setIsDetailsClassN} />
      )}
      <div
        onClick={() => setIsDetailsClassN(true)}
        className="flex justify-center items-center flex-col"
      >
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="text-xl font-bold">{total} Units</p>
            <span className="text-sm">Class N</span>
          </>
        )}
      </div>
    </>
  );
}
