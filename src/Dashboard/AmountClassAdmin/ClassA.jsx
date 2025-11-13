import React, { useState } from "react";
import { useProductTotalByClass } from "../../hooks/useProductTotalByClass.js";
import DetailClassA from "../DetailsAdmin/DetailClassA.jsx";

export default function ClassA() {
  const [isDetailsClassA, setIsDetailsClassA] = useState(false);

  //  ใช้ hook ใหม่ (แยกจากตัวแบ่งหน้า)
  const { total, loading, error } = useProductTotalByClass({
    classType: "manual",
    className: "A",
  });

  return (
    <>
      {isDetailsClassA && (
        <DetailClassA setIsDetailsClassA={setIsDetailsClassA} />
      )}

      <div
        onClick={() => setIsDetailsClassA(true)}
        className="flex justify-center items-center flex-col"
      >
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="text-xl font-bold">{total} Units</p>
            <span className="text-sm">Class A</span>
          </>
        )}
      </div>
    </>
  );
}
