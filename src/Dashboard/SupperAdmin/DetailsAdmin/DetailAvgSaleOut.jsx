import React, { useState } from "react";

export default function DetailAvgSaleOut({ setIsDetailsAvg }) {
  // Mock data ที่ใช้แสดงในตาราง (เพิ่มข้อมูลให้หลากหลายขึ้น)
  const mockProducts = [
    { id: "P001", name: "สินค้า A: น้ำหอมปรับอากาศ", code: "H001", forecast: 1500, actualCut: 1250, diff: -250 },
    { id: "P002", name: "สินค้า B: สบู่ล้างหน้า", code: "S002", forecast: 2200, actualCut: 2250, diff: 50 },
    { id: "P003", name: "สินค้า C: แชมพูสระผม", code: "S003", forecast: 800, actualCut: 800, diff: 0 },
    { id: "P004", name: "สินค้า D: โลชั่นบำรุงผิว", code: "L004", forecast: 3000, actualCut: 2800, diff: -200 },
    { id: "P005", name: "สินค้า E: ยาสีฟันสมุนไพร", code: "T005", forecast: 500, actualCut: 650, diff: 150 },
    { id: "P006", name: "สินค้า F: กระดาษทิชชู่", code: "C006", forecast: 1800, actualCut: 1800, diff: 0 },
  ];

  // State สำหรับเก็บข้อความค้นหา (Search term)
  const [searchTerm, setSearchTerm] = useState("");

  // Function กรองข้อมูลตามคำค้นหา
  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function จัดรูปแบบตัวเลขให้มีคอมม่า
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  return (
    // Backdrop/Overlay (ทำให้มืดจางๆ)
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      
      {/* Modal / Side Panel */}
      <div className="bg-white w-full lg:w-3/5 xl:w-1/2 h-full overflow-y-auto p-6 shadow-2xl z-50 transform transition-transform duration-300 ease-out translate-x-0">
        
        {/* Header และ ปุ่มปิด */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
            <h1 className="text-3xl font-extrabold text-[#640037]">
                ยอดตัดจ่ายเทียบ Forecast
                <p className="text-base font-normal text-gray-500 mt-1">รายละเอียดสินค้าแยกตามรหัสและชื่อ</p>
            </h1>
            <button
                onClick={() => setIsDetailsAvg(false)}
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
                <th className="p-3 text-right border-r border-pink-700 w-[120px]">Forecast (หน่วย)</th>
                <th className="p-3 text-right border-r border-pink-700 w-[120px]">ยอดตัดจ่าย (หน่วย)</th>
                <th className="p-3 text-right w-[120px]">ส่วนต่าง</th>
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
                    <td className="p-3 text-right text-gray-600">{formatNumber(product.forecast)}</td>
                    <td className="p-3 text-right font-semibold text-[#640037]">{formatNumber(product.actualCut)}</td>
                    <td 
                      className={`p-3 text-right font-bold ${
                        product.diff > 0 ? 'text-green-600' : 
                        product.diff < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}
                    >
                      {formatNumber(product.diff)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    ไม่พบข้อมูลสินค้าที่ตรงกับคำค้นหา "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer (สำหรับพื้นที่ว่างด้านล่างของ Modal) */}
        <div className="h-12"></div>
      </div>
    </div>
  );
}