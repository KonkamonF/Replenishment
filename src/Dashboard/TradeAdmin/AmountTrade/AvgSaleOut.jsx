import React, { useState } from "react";
import DetailAvgSaleOut from "../../SupperAdmin/DetailsAdmin/DetailAvgSaleOut";

export default function AvgSaleOut() {
  const [isDetailsAvg, setIsDetailsAvg] = useState(false);
  return (
    <>
      {isDetailsAvg && <DetailAvgSaleOut setIsDetailsAvg={setIsDetailsAvg} />}
      <div
        onClick={() => setIsDetailsAvg(true)}
        className="border-2 p-2 rounded-3xl hover:bg-gray-300"
      >
        ยอดตัดจ่ายเทียบ Forecast ราย SKU
      </div>
    </>
  );
}
