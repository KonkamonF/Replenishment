import React, { useState } from "react";
import { useProductTotalByClass } from "../hooks/useProductTotalByClass";
import DetailClassA from "../DetailsAdmin/DetailClassA";

export default function ClassA() {
  const [isDetailsClassA, setIsDetailsClassA] = useState(false);

  // ✅ ใช้ hook ใหม่ (แยกจากตัวแบ่งหน้า)
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
      >
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="text-3xl font-bold">{total} Units</p>
            <span className="font-bold text-lg">A</span>
          </>
        )}
      </div>
    </>
  );
}
