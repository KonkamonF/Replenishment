import React, { useState } from "react";
import { useProductTotalByClass } from "../hooks/useProductTotalByClass";
import DetailClassC from "../DetailsAdmin/DetailClassC";

export default function ClassC() {
  const [isDetailsClassC, setIsDetailsClassC] = useState(false);

  // ✅ ใช้ hook ใหม่ (แยกจากตัวแบ่งหน้า)
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
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="text-3xl font-bold">{total} Units</p>
            Class <span className="font-bold text-xl">C</span>
          </>
        )}
      </div>
    </>
  );
}
