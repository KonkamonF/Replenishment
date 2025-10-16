import React, { useState } from "react";

export default function DetailClassA({ setIsDetailsClassA }) {
  // Mock data สำหรับสินค้า Class A (High Value / High Volume)
  const mockClassAProducts = [
    {
      id: "A101",
      name: "ชุดบำรุงผิวพรีเมียม",
      code: "CP01",
      volumeShare: 8.5,
      valueShare: 15.2,
      inventoryDays: 30,
    },
    {
      id: "A102",
      name: "เครื่องดื่มชูกำลังรสใหม่",
      code: "DR25",
      volumeShare: 7.1,
      valueShare: 5.8,
      inventoryDays: 15,
    },
    {
      id: "A103",
      name: "แท็บเล็ตมัลติฟังก์ชัน",
      code: "E080",
      volumeShare: 3.2,
      valueShare: 10.5,
      inventoryDays: 45,
    },
    {
      id: "A104",
      name: "ผงซักฟอกสูตรยับยั้งแบคทีเรีย",
      code: "H305",
      volumeShare: 9.8,
      valueShare: 7.1,
      inventoryDays: 20,
    },
    {
      id: "A105",
      name: "กาแฟแคปซูลสำหรับเครื่องรุ่นล่าสุด",
      code: "F701",
      volumeShare: 4.0,
      valueShare: 6.5,
      inventoryDays: 28,
    },
  ];

  // State สำหรับเก็บข้อความค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  // Function กรองข้อมูลตามคำค้นหา (ค้นหาจากชื่อหรือรหัส)
  const filteredProducts = mockClassAProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function จัดรูปแบบตัวเลข (ใช้สำหรับเปอร์เซ็นต์หรือวันคงคลัง)
  const formatNumber = (num, isPercent = false) => {
    const formatted = num.toLocaleString("en-US", {
      minimumFractionDigits: isPercent ? 1 : 0,
      maximumFractionDigits: isPercent ? 1 : 0,
    });
    return formatted + (isPercent ? "%" : "");
  };

  return (
    // Backdrop/Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      {/* Modal / Side Panel */}
      <div className="bg-white w-full h-full p-6 shadow-2xl z-50 ">
        {/* Header และ ปุ่มปิด */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037]">
            สินค้า Class A
            <p className="text-base font-normal text-gray-500 mt-1">
              สินค้าที่มีความสำคัญสูงต่อยอดขายและมูลค่ารวม
            </p>
          </h1>
          <button
            onClick={() => setIsDetailsClassA(false)}
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
                <th className="p-3 text-left border-r border-pink-700 w-[100px]">
                  รหัสสินค้า
                </th>
                <th className="p-3 text-left border-r border-pink-700">
                  ชื่อสินค้า
                </th>
                <th className="p-3 text-right border-r border-pink-700 w-[120px]">
                  สัดส่วนปริมาณขาย
                </th>
                <th className="p-3 text-right border-r border-pink-700 w-[120px]">
                  สัดส่วนมูลค่าขาย
                </th>
                <th className="p-3 text-right w-[100px]">คงคลัง (วัน)</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
                  >
                    <td className="p-3 text-left font-medium">
                      {product.code}
                    </td>
                    <td className="p-3 text-left">{product.name}</td>
                    <td className="p-3 text-right font-semibold text-pink-700">
                      {formatNumber(product.volumeShare, true)}
                    </td>
                    <td className="p-3 text-right font-bold text-[#640037]">
                      {formatNumber(product.valueShare, true)}
                    </td>
                    <td className="p-3 text-right text-gray-600">
                      {formatNumber(product.inventoryDays)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    ไม่พบข้อมูลสินค้า Class A ที่ตรงกับคำค้นหา "{searchTerm}"
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
