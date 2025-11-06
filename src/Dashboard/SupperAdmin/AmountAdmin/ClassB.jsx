import React, { useState } from "react";
import { useProductTotalByClass } from "../hooks/useProductTotalByClass";
import DetailClassB from "../DetailsAdmin/DetailClassB";

export default function ClassB() {
  const [isDetailsClassB, setIsDetailsClassB] = useState(false);

  // ✅ ใช้ hook ใหม่ (แยกจากตัวแบ่งหน้า)
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
        onClick={() => setIsDetailsClassB(true)}
      >
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="text-3xl font-bold">{total} Units</p>
            Class <span className="font-bold text-xl">B</span>
          </>
        )}
      </div>
    </>
  );
}
