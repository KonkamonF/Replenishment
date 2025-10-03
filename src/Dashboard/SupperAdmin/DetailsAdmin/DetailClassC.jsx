import React, { useState } from "react";

export default function DetailClassC({ setIsDetailsClassC }) {
  // Mock data สำหรับสินค้า Class C (Low Value / High Volume หรือ Low Value / Low Volume)
  const mockClassCProducts = [
    { id: "C301", name: "คลิปหนีบกระดาษขนาดเล็ก (แพ็ค 100)", code: "ST01", volumeShare: 55.0, valueShare: 3.5, inventoryDays: 180, lastSale: 95 },
    { id: "C302", name: "น้ำยาล้างจานสูตรเก่า", code: "H105", volumeShare: 15.0, valueShare: 2.1, inventoryDays: 120, lastSale: 40 },
    { id: "C303", name: "แปรงสีฟันสำหรับเด็ก (สีเขียว)", code: "D203", volumeShare: 5.0, valueShare: 1.5, inventoryDays: 200, lastSale: 150 },
    { id: "C304", name: "สายชาร์จโทรศัพท์รุ่นเก่า", code: "E990", volumeShare: 1.5, valueShare: 0.8, inventoryDays: 360, lastSale: 25 },
    { id: "C305", name: "ถุงพลาสติกบรรจุภัณฑ์ (เล็ก)", code: "PK50", volumeShare: 10.0, valueShare: 1.2, inventoryDays: 90, lastSale: 60 },
  ];

  // State สำหรับเก็บข้อความค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  // Function กรองข้อมูลตามคำค้นหา (ค้นหาจากชื่อหรือรหัส)
  const filteredProducts = mockClassCProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function จัดรูปแบบตัวเลข (สำหรับเปอร์เซ็นต์, วัน, และจำนวน)
  const formatNumber = (num, isPercent = false) => {
    const formatted = num.toLocaleString('en-US', {
      minimumFractionDigits: isPercent ? 1 : 0,
      maximumFractionDigits: isPercent ? 1 : 0
    });
    return formatted + (isPercent ? '%' : '');
  };

  return (
    // Backdrop/Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      
      {/* Modal / Side Panel */}
      <div className="bg-white w-full lg:w-3/5 xl:w-1/2 h-full overflow-y-auto p-6 shadow-2xl z-50 transform transition-transform duration-300 ease-out translate-x-0">
        
        {/* Header และ ปุ่มปิด */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
            <h1 className="text-3xl font-extrabold text-[#640037]">
                สินค้า Class C
                <p className="text-base font-normal text-gray-500 mt-1">สินค้าที่มีสัดส่วนมูลค่าขายต่ำ แต่มีจำนวนมากหรือสต็อกยาวนาน</p>
            </h1>
            <button
                onClick={() => setIsDetailsClassC(false)}
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
                <th className="p-3 text-right border-r border-pink-700 w-[120px]">สัดส่วนมูลค่าขาย</th>
                <th className="p-3 text-right border-r border-pink-700 w-[100px]">คงคลัง (วัน)</th>
                <th className="p-3 text-right w-[100px]">วันขายล่าสุด (วัน)</th>
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
                    <td className="p-3 text-right font-semibold text-gray-600">
                        {formatNumber(product.valueShare, true)}
                    </td>
                    <td className="p-3 text-right font-bold text-red-600">
                        {formatNumber(product.inventoryDays)}
                    </td>
                    <td className="p-3 text-right text-orange-500">
                        {formatNumber(product.lastSale)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    ไม่พบข้อมูลสินค้า Class C ที่ตรงกับคำค้นหา "{searchTerm}"
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