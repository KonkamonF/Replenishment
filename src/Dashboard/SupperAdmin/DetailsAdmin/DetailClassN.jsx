import React, { useState } from "react";

export default function DetailClassN({ setIsDetailsClassN }) {
  // Mock data สำหรับสินค้า Class N (New/Unclassified Items)
  const mockClassNProducts = [
    { id: "N401", name: "เซรั่มบำรุงผิวสูตรใหม่ล่าสุด", code: "NS01", launchDate: "2025-09-01", weeksSinceLaunch: 4, initialStock: 5000 },
    { id: "N402", name: "หูฟังไร้สาย (รุ่นเบต้า)", code: "EW12", launchDate: "2025-08-15", weeksSinceLaunch: 7, initialStock: 1200 },
    { id: "N403", name: "ขนมขบเคี้ยวรสชาติแปลกใหม่", code: "SN99", launchDate: "2025-09-20", weeksSinceLaunch: 2, initialStock: 15000 },
    { id: "N404", name: "หนังสืออัตชีวประวัติ", code: "BK05", launchDate: "2025-07-01", weeksSinceLaunch: 13, initialStock: 800 },
    { id: "N405", name: "กล้องติดรถยนต์ (รุ่นพรีออเดอร์)", code: "CE08", launchDate: "2025-10-01", weeksSinceLaunch: 0, initialStock: 300 },
  ];

  // State สำหรับเก็บข้อความค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  // Function กรองข้อมูลตามคำค้นหา (ค้นหาจากชื่อหรือรหัส)
  const filteredProducts = mockClassNProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function จัดรูปแบบตัวเลขให้มีคอมม่า
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  return (
    // Backdrop/Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      
      {/* Modal / Side Panel */}
      <div className="bg-white w-full  h-full  p-6 shadow-2xl z-50">
        
        {/* Header และ ปุ่มปิด */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
            <h1 className="text-3xl font-extrabold text-[#640037]">
                สินค้า Class N (New Items)
                <p className="text-base font-normal text-gray-500 mt-1">รายละเอียดสินค้าใหม่ที่อยู่ระหว่างการประเมินและติดตามผล</p>
            </h1>
            <button
                onClick={() => setIsDetailsClassN(false)}
                className="text-4xl text-gray-500 hover:text-[#640037] transition duration-200 p-1 leading-none"
                aria-label="Close"
            >
                &times;
            </button>
        </div>

        {/* Input สำหรับค้นหา */}
        <div className="mb-6">
            <input
                type="text"
                placeholder="ค้นหาด้วยชื่อสินค้า หรือรหัสสินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition duration-150"
            />
        </div>

        {/* ตารางข้อมูล */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-[#640037] text-white">
              <tr>
                <th className="p-3 text-left border-r border-pink-700 w-[100px]">รหัสสินค้า</th>
                <th className="p-3 text-left border-r border-pink-700">ชื่อสินค้า</th>
                <th className="p-3 text-center border-r border-pink-700 w-[120px]">วันที่เปิดตัว</th>
                <th className="p-3 text-right border-r border-pink-700 w-[100px]">เปิดตัวมาแล้ว (สัปดาห์)</th>
                <th className="p-3 text-right w-[120px]">สต็อกเริ่มต้น (หน่วย)</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
                  >
                    <td className="p-3 text-left font-medium">{product.code}</td>
                    <td className="p-3 text-left">{product.name}</td>
                    <td className="p-3 text-center text-gray-600">{product.launchDate}</td>
                    <td className="p-3 text-right font-semibold text-green-700">
                        {product.weeksSinceLaunch}
                    </td>
                    <td className="p-3 text-right font-bold text-[#640037]">
                        {formatNumber(product.initialStock)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    ไม่พบข้อมูลสินค้า Class N ที่ตรงกับคำค้นหา "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="h-12"></div>
      </div>
    </div>
  );
}