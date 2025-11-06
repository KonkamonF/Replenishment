import React, { useState } from "react";
import { useProductTotalByClass } from "../hooks/useProductTotalByClass";
import DetailClassN from "../DetailsAdmin/DetailClassN";

export default function ClassN() {
  const [isDetailsClassN, setIsDetailsClassN] = useState(false);

  // ✅ ใช้ hook ใหม่ (แยกจากตัวแบ่งหน้า)
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
      >
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="text-3xl font-bold">{total} Units</p>
            Class <span className="font-bold text-xl">N</span>
          </>
        )}
      </div>
    </>
  );
}
