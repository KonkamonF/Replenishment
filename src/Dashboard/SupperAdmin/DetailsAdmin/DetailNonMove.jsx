import React, { useState } from "react";

export default function DetailNonMove({ setIsDetailsNonMove }) {
  // Mock data สำหรับสินค้าไม่เคลื่อนไหว (Non-Moving Items)
  const mockNonMoveProducts = [
    { id: "NM501", name: "เครื่องเล่น DVD รุ่นเก่า", code: "E101X", inventoryQty: 120, inventoryValue: 120000, lastSaleDays: 450, isObsolete: true },
    { id: "NM502", name: "ชุดเครื่องเขียนลายเทศกาลปีที่แล้ว", code: "ST88A", inventoryQty: 500, inventoryValue: 50000, lastSaleDays: 300, isObsolete: false },
    { id: "NM503", name: "รองเท้าแตะเบอร์ 35 (สีม่วง)", code: "SH35P", inventoryQty: 80, inventoryValue: 16000, lastSaleDays: 600, isObsolete: true },
    { id: "NM504", name: "สารเคมีบรรจุภัณฑ์เสียหาย (รอทำลาย)", code: "CH02Z", inventoryQty: 5, inventoryValue: 500000, lastSaleDays: 720, isObsolete: true },
    { id: "NM505", name: "กระติกน้ำร้อนไฟฟ้า (รุ่นที่เลิกผลิต)", code: "H510", inventoryQty: 250, inventoryValue: 87500, lastSaleDays: 185, isObsolete: true },
  ];

  // State สำหรับเก็บข้อความค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  // Function กรองข้อมูลตามคำค้นหา (ค้นหาจากชื่อหรือรหัส)
  const filteredProducts = mockNonMoveProducts.filter(product =>
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
      <div className="bg-white w-full lg:w-3/5 xl:w-1/2 h-full overflow-y-auto p-6 shadow-2xl z-50 transform transition-transform duration-300 ease-out translate-x-0">
        
        {/* Header และ ปุ่มปิด */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
            <h1 className="text-3xl font-extrabold text-[#640037]">
                สินค้าไม่เคลื่อนไหว (Non-Move)
                <p className="text-base font-normal text-gray-500 mt-1">รายการสินค้าที่ไม่มีการขาย/ตัดจ่ายเกินกว่า 1 ปี</p>
            </h1>
            <button
                onClick={() => setIsDetailsNonMove(false)}
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
                <th className="p-3 text-right border-r border-pink-700 w-[100px]">ปริมาณคงคลัง</th>
                <th className="p-3 text-right border-r border-pink-700 w-[130px]">มูลค่าคงคลัง (บาท)</th>
                <th className="p-3 text-right w-[100px]">ไม่ได้ขาย (วัน)</th>
                <th className="p-3 text-center w-[100px]">สถานะ</th>
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
                    <td className="p-3 text-right text-red-600 font-semibold">
                        {formatNumber(product.inventoryQty)}
                    </td>
                    <td className="p-3 text-right font-bold text-[#640037]">
                        ฿{formatNumber(product.inventoryValue)}
                    </td>
                    <td className="p-3 text-right font-bold text-red-700">
                        {formatNumber(product.lastSaleDays)}
                    </td>
                    <td className="p-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.isObsolete 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-orange-100 text-orange-800'
                        }`}>
                            {product.isObsolete ? 'ล้าสมัย' : 'เฝ้าระวัง'}
                        </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    ไม่พบข้อมูลสินค้าไม่เคลื่อนไหวที่ตรงกับคำค้นหา "{searchTerm}"
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