import React, { useState } from "react";

export default function DetailBest({ setIsDetailsBest }) {
  // Mock data สำหรับสินค้าขายดี (Top-performing items)
  const mockBestProducts = [
    { id: "B001", name: "เครื่องสำอางกันน้ำรุ่นพิเศษ", code: "C901", salesVolume: 5800, salesValue: 1250000 },
    { id: "B002", name: "กาแฟพรีเมียมคั่วเข้ม", code: "F720", salesVolume: 4500, salesValue: 980000 },
    { id: "B003", name: "น้ำยาปรับผ้านุ่มสูตรเข้มข้น", code: "H312", salesVolume: 7100, salesValue: 650000 },
    { id: "B004", name: "วิตามินเสริมอาหาร (แพ็คคู่)", code: "V110", salesVolume: 3200, salesValue: 1550000 },
    { id: "B005", name: "ปากกาเจลสีดำ 0.5mm (กล่อง)", code: "S405", salesVolume: 9000, salesValue: 180000 },
    { id: "B006", name: "โทรศัพท์มือถือรุ่นยอดนิยม", code: "E010", salesVolume: 1200, salesValue: 18000000 },
  ];

  // State สำหรับเก็บข้อความค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  // Function กรองข้อมูลตามคำค้นหา (ค้นหาจากชื่อหรือรหัส)
  const filteredProducts = mockBestProducts.filter(product =>
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
                Best-Selling Products
                <p className="text-base font-normal text-gray-500 mt-1">รายละเอียดสินค้าที่มียอดขายดีที่สุด</p>
            </h1>
            <button
                onClick={() => setIsDetailsBest(false)}
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
                <th className="p-3 text-right border-r border-pink-700 w-[120px]">ปริมาณขาย (หน่วย)</th>
                <th className="p-3 text-right w-[150px]">มูลค่าขาย (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr 
                    key={product.id} 
                    className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
                  >
                    <td className="p-3 text-left font-medium">{product.code}</td>
                    <td className="p-3 text-left">{product.name}</td>
                    <td className="p-3 text-right font-semibold text-[#640037]">
                        {formatNumber(product.salesVolume)}
                    </td>
                    <td className="p-3 text-right font-bold text-green-700">
                        ฿{formatNumber(product.salesValue)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    ไม่พบข้อมูลสินค้าขายดีที่ตรงกับคำค้นหา "{searchTerm}"
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