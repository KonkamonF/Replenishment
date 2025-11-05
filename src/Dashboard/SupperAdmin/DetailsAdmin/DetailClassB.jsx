import React, { useState } from "react";

export default function DetailClassB({ setIsDetailsClassB }) {
  // Mock data สำหรับสินค้า Class B (Medium Value / Medium Volume)
  const mockClassBProducts = [
    { id: "B201", name: "สมุดโน้ตปกแข็ง A5", code: "S420", volumeShare: 15.5, valueShare: 18.2, inventoryDays: 60, reorderQty: 500 },
    { id: "B202", name: "ชุดมีดทำครัวสแตนเลส", code: "H115", volumeShare: 5.0, valueShare: 8.5, inventoryDays: 90, reorderQty: 100 },
    { id: "B203", name: "หลอดไฟ LED ประหยัดพลังงาน", code: "E035", volumeShare: 12.0, valueShare: 10.0, inventoryDays: 45, reorderQty: 1000 },
    { id: "B204", name: "เครื่องปั่นผลไม้ขนาดเล็ก", code: "K205", volumeShare: 4.5, valueShare: 7.8, inventoryDays: 75, reorderQty: 250 },
    { id: "B205", name: "ผ้าขนหนูไมโครไฟเบอร์ (แพ็ค 3)", code: "T550", volumeShare: 8.8, valueShare: 6.2, inventoryDays: 50, reorderQty: 800 },
  ];

  // State สำหรับเก็บข้อความค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  // Function กรองข้อมูลตามคำค้นหา (ค้นหาจากชื่อหรือรหัส)
  const filteredProducts = mockClassBProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function จัดรูปแบบตัวเลข (สำหรับเปอร์เซ็นต์, วัน, และปริมาณสั่งซื้อ)
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
      <div className="bg-white w-full h-full p-6 shadow-2xl z-50 overflow-y-auto"> 
        
        {/* Header และ ปุ่มปิด */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
            <h1 className="text-3xl font-extrabold text-[#640037]">
                สินค้า Class B
                <p className="text-base font-normal text-gray-600 mt-1">
                    สินค้าที่มีความสำคัญระดับกลางและต้องการการบริหารจัดการที่สมดุล
                </p>
            </h1>
            <button
                onClick={() => setIsDetailsClassB(false)}
                className="text-4xl text-gray-500 hover:text-[#640037] transition p-1 leading-none"
                aria-label="Close"
            >
                &times;
            </button>
        </div>

        {/* Input สำหรับค้นหา (ปรับปรุงสไตล์) */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <input
                type="text"
                placeholder="ค้นหาด้วยชื่อสินค้า หรือรหัสสินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-screen p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition" 
            />
               <div className="flex justify-end gap-2">
          <select
            defaultValue="select"
            className="p-2.5 pr-24 border border-gray-300  focus:border-pink-700 focus:ring-pink-700  shadow-sm 
                hover:bg-amber-50 cursor-pointer rounded-lg" // <--- เพิ่มคลาสที่นี่
          >
            <option className="text-gray-500" value="select">
              Select...
            </option>
            <option value="set">Set</option>
            <option value="nonSet">แยกSet</option>
          </select>
        </div>
        </div>

        {/* ตารางข้อมูล */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border-2 border-gray-200">
            {/* Header (ปรับปรุงสไตล์) */}
            <thead className="bg-[#640037] text-white">
              <tr>
                <th className="p-3 text-left">รหัสสินค้า</th>
                <th className="p-3 text-left">ชื่อสินค้า</th>
                <th className="p-3 text-right">สัดส่วนปริมาณขาย</th>
                <th className="p-3 text-right">สัดส่วนมูลค่าขาย</th>
                <th className="p-3 text-right">คงคลัง (วัน)</th>
                <th className="p-3 text-right">ปริมาณสั่งซื้อแนะนำ</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="border-b hover:bg-amber-50 transition" // ปรับ hover
                  >
                    <td className="p-3 text-left font-medium">{product.code}</td>
                    <td className="p-3 text-left">{product.name}</td>
                    {/* ปรับสไตล์ตัวเลข (เพิ่ม VolumeShare และใช้สไตล์ราคากลาง) */}
                    <td className="p-3 text-right text-gray-700">
                        {formatNumber(product.volumeShare, true)}
                    </td>
                    <td className="p-3 text-right font-bold text-[#640037]"> {/* สไตล์เหมือนราคากลาง */}
                        {formatNumber(product.valueShare, true)}
                    </td>
                    <td className="p-3 text-right text-gray-600"> {/* สไตล์เหมือน Lead Time */}
                        {formatNumber(product.inventoryDays)}
                    </td>
                    <td className="p-3 text-right font-semibold text-pink-700"> {/* สไตล์เหมือนราคาต่ำสุด */}
                        {formatNumber(product.reorderQty)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    ไม่พบข้อมูลสินค้า Class B ที่ตรงกับคำค้นหา "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer (เพื่อเว้นที่ว่างด้านล่าง) */}
        <div className="h-12"></div>
      </div>
    </div>
  );
}