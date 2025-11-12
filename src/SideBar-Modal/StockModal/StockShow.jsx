import React, { useState, useMemo } from "react";

// Mock data สำหรับสินค้าไม่เคลื่อนไหว (Non-Moving Items)
const mockNonMoveProducts = [
  {
    id: "NM501",
    name: "เครื่องเล่น DVD รุ่นเก่า",
    code: "E101X",
    inventoryQty: 120,
    inventoryValue: 120000,
    lastSaleDays: 450,
    isObsolete: true,
  },
  {
    id: "NM502",
    name: "ชุดเครื่องเขียนลายเทศกาลปีที่แล้ว",
    code: "ST88A",
    inventoryQty: 500,
    inventoryValue: 50000,
    lastSaleDays: 300,
    isObsolete: false,
  },
  {
    id: "NM503",
    name: "รองเท้าแตะเบอร์ 35 (สีม่วง)",
    code: "SH35P",
    inventoryQty: 80,
    inventoryValue: 16000,
    lastSaleDays: 600,
    isObsolete: true,
  },
  {
    id: "NM504",
    name: "สารเคมีบรรจุภัณฑ์เสียหาย (รอทำลาย)",
    code: "CH02Z",
    inventoryQty: 5,
    inventoryValue: 500000,
    lastSaleDays: 720,
    isObsolete: true,
  },
  {
    id: "NM505",
    name: "กระติกน้ำร้อนไฟฟ้า (รุ่นที่เลิกผลิต)",
    code: "H510",
    inventoryQty: 250,
    inventoryValue: 87500,
    lastSaleDays: 185,
    isObsolete: true,
  },
];

export default function StockShow({ setIsStockShow }) {
  // State สำหรับเก็บข้อความค้นหา
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // เพิ่ม State สำหรับ Pagination (จำลอง)
  const pageSize = 10; // กำหนดขนาดหน้า (จำลอง)

  // Function กรองข้อมูลตามคำค้นหา (ค้นหาจากชื่อหรือรหัส)
  const filteredProducts = mockNonMoveProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // จำลอง Pagination
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [page, filteredProducts, pageSize]);

  // Function จัดรูปแบบตัวเลขให้มีคอมม่า
  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 }); // จำกัดทศนิยมเป็น 0
  };

  return (
    // Backdrop/Overlay (ใช้ fixed inset-0 เหมือนตัวอย่างเต็มจอ)
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      {/* Modal / Side Panel (ใช้ w-full h-full เพื่อขยายเต็มจอ) */}
      {/* ลบ max-w-7xl/md:max-w-4xl ออกเพื่อเป็น Full Screen */}
      <div className="bg-white w-full h-full p-6 shadow-2xl z-50 overflow-y-auto">
        {/* Header และ ปุ่มปิด (ใช้สีหลัก #640037) */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037]">
            Stock ตัวโชว์
            <p className="text-base font-normal text-gray-600 mt-1">
              รายการสินค้าตัวโชว์ตาม Location
              <span className="ml-4 text-xs text-gray-400">
                หน้าปัจจุบัน : {page} (จำลอง)
              </span>
            </p>
          </h1>
          <button
            onClick={() => setIsStockShow(false)}
            className="text-4xl text-gray-500 hover:text-[#640037] transition p-1 leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Input สำหรับค้นหา (ใช้ w-full เพื่อให้ยืดเต็มพื้นที่ใน Modal) */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อสินค้า หรือรหัสสินค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // เปลี่ยน w-screen เป็น w-full เพื่อให้พอดีกับ Modal
            className="w-full p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition"
          />
          <div className="flex justify-end gap-2">
            <select
              defaultValue="select"
              className="p-2.5 pr-24 border border-gray-300 focus:border-pink-700 focus:ring-pink-700 shadow-sm hover:bg-amber-50 cursor-pointer rounded-lg"
            >
              <option className="text-gray-500" value="select">
                Select...
              </option>
              <option value="set">Set</option>
              <option value="nonSet">แยกSet</option>
            </select>
          </div>
        </div>

        {/* ตารางข้อมูล (ใช้ CSS และสีตาม Class A/Non-Move) */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border-2 border-gray-200">
            {/* Header (ใช้ bg-[#640037] text-white เหมือนตัวอย่าง) */}
            <thead className="bg-[#640037] text-white">
              <tr>
                <th className="p-3 text-left">รหัสสินค้า</th>
                <th className="p-3 text-left">ชื่อสินค้า</th>
                <th className="p-3 text-right">ปริมาณคงคลัง</th>
                <th className="p-3 text-right">มูลค่าคงคลัง (บาท)</th>
                <th className="p-3 text-right">ไม่ได้ขาย (วัน)</th>
                <th className="p-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-amber-50 transition"
                  >
                    <td className="p-3 text-left font-medium">
                      {product.code}
                    </td>
                    <td className="p-3 text-left">{product.name}</td>
                    {/* ปริมาณคงคลัง */}
                    <td className="p-3 text-right text-red-700 font-semibold">
                      {formatNumber(product.inventoryQty)}
                    </td>
                    {/* มูลค่าคงคลัง */}
                    <td className="p-3 text-right font-bold text-[#640037]">
                      ฿{formatNumber(product.inventoryValue)}
                    </td>
                    {/* ไม่ได้ขาย (วัน) */}
                    <td
                      className="p-3 text-right font-bold 
                      // ใส่สีเน้นความเสี่ยงตามจำนวนวัน
                      ${product.lastSaleDays > 365 ? 'text-red-700' : 'text-orange-600'}"
                    >
                      {formatNumber(product.lastSaleDays)}
                    </td>
                    {/* สถานะ */}
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.isObsolete
                            ? "bg-pink-100 text-red-800 border border-red-800"
                            : "bg-amber-100 text-orange-800 border border-orange-800"
                        }`}
                      >
                        {product.isObsolete ? "ล้าสมัย" : "เฝ้าระวัง"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-4 text-center text-lg text-gray-500"
                  >
                    ไม่พบข้อมูลสินค้าไม่เคลื่อนไหวที่ตรงกับคำค้นหา "{searchTerm}
                    "
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (จำลอง) */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-pink-100 disabled:opacity-50"
          >
            ← หน้าก่อนหน้า
          </button>
          <span className="text-gray-600 mt-1">
            หน้า {page} / {Math.ceil(filteredProducts.length / pageSize)}
          </span>
          <button
            disabled={page * pageSize >= filteredProducts.length}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-[#640037] text-white rounded hover:bg-pink-700 disabled:opacity-50"
          >
            หน้าถัดไป →
          </button>
        </div>

        {/* Footer (เพื่อเว้นที่ว่างด้านล่าง) */}
        <div className="h-12"></div>
      </div>
    </div>
  );
}
