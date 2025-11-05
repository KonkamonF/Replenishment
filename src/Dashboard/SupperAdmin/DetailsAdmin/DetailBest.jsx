import React, { useState } from "react";

export default function DetailBest({ setIsDetailsBest }) {
  // Mock data สำหรับสินค้าขายดี (Top-performing items)
  const mockBestProducts = [
    {
      id: "B001",
      name: "เครื่องสำอางกันน้ำรุ่นพิเศษ",
      code: "C901",
      salesVolume: 5800,
      salesValue: 1250000,
    },
    {
      id: "B002",
      name: "กาแฟพรีเมียมคั่วเข้ม",
      code: "F720",
      salesVolume: 4500,
      salesValue: 980000,
    },
    {
      id: "B003",
      name: "น้ำยาปรับผ้านุ่มสูตรเข้มข้น",
      code: "H312",
      salesVolume: 7100,
      salesValue: 650000,
    },
    {
      id: "B004",
      name: "วิตามินเสริมอาหาร (แพ็คคู่)",
      code: "V110",
      salesVolume: 3200,
      salesValue: 1550000,
    },
    {
      id: "B005",
      name: "ปากกาเจลสีดำ 0.5mm (กล่อง)",
      code: "S405",
      salesVolume: 9000,
      salesValue: 180000,
    },
    {
      id: "B006",
      name: "โทรศัพท์มือถือรุ่นยอดนิยม",
      code: "E010",
      salesVolume: 1200,
      salesValue: 18000000,
    },
  ];

  // State สำหรับเก็บข้อความค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  // Function กรองข้อมูลตามคำค้นหา (ค้นหาจากชื่อหรือรหัส)
  const filteredProducts = mockBestProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function จัดรูปแบบตัวเลขให้มีคอมม่า
  const formatNumber = (num) => {
    return num.toLocaleString("en-US");
  };

  return (
    // Backdrop/Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      {/* Modal / Side Panel */}
      <div className="bg-white w-full h-full p-6 shadow-2xl z-50 overflow-y-auto">
        {/* Header และ ปุ่มปิด (ปรับตาม Class A) */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037]">
            Best-Selling Products
            <p className="text-base font-normal text-gray-600 mt-1">
              รายละเอียดสินค้าที่มียอดขายดีที่สุด
            </p>
          </h1>
          <button
            onClick={() => setIsDetailsBest(false)}
            className="text-4xl text-gray-500 hover:text-[#640037] transition p-1 leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Input สำหรับค้นหา (ปรับตาม Class A) */}
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

        {/* ตารางข้อมูล (ปรับตาม Class A) */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border-2 border-gray-200">
            {/* Header (ปรับตาม Class A) */}
            <thead className="bg-[#640037] text-white">
              <tr>
                <th className="p-3 text-left">รหัสสินค้า</th>
                <th className="p-3 text-left">ชื่อสินค้า</th>
                <th className="p-3 text-right">ปริมาณขาย (หน่วย)</th>
                <th className="p-3 text-right">มูลค่าขาย (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-amber-50 transition" // ปรับ hover
                  >
                    <td className="p-3 text-left font-medium">
                      {product.code}
                    </td>
                    <td className="p-3 text-left">{product.name}</td>
                    {/* ปริมาณขาย: เน้นด้วยสีหลัก */}
                    <td className="p-3 text-right font-semibold text-[#640037]">
                      {formatNumber(product.salesVolume)}
                    </td>
                    {/* มูลค่าขาย: เน้นด้วยสีเขียว (ความสำเร็จ) */}
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

        {/* Footer (เพื่อเว้นที่ว่างด้านล่าง) */}
        <div className="h-12"></div>
      </div>
    </div>
  );
}
