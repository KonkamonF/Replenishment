import React from "react";
import { useProductByClass } from "../../hooks/useProductByClass.js";
import { NativeAnimationWrapper } from "motion";

export default function DetailClassA({ setIsDetailsClassC }) {
  const token = import.meta.env.VITE_API_TOKEN;
  const {
    data: products,
    loading: isLoading,
    error,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    pageSize: offset,
    total,
  } = useProductByClass({
    classType: "manual",
    className: "C",
    token,
    initialPageSize: 50,
  });

  const filteredProducts = products.filter(
    (p) =>
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num) =>
    num ? num.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "-";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      <div className="bg-white w-full h-full p-6 shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037]">
            สินค้า Class C
            <p className="text-base text-gray-600 mt-1">
              หน้าปัจจุบัน : {page}
            </p>
          </h1>
          <button
            onClick={() => setIsDetailsClassC(false)}
            className="text-4xl text-gray-500 hover:text-[#640037] transition p-1 leading-none"
          >
            &times;
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า, รหัสสินค้า, หรือยี่ห้อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-screen p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition"
          />
                  {/* Action Buttons */}
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


        {/* Table */}
        {isLoading ? (
          <p className="text-center text-gray-500 py-10 animate-pulse">
             กำลังโหลดข้อมูลหน้า {page}...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 py-10">
             โหลดข้อมูลไม่สำเร็จ: {error}
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-10">ไม่พบสินค้า</p>
        ) : (
          <>
            <table className="min-w-full border-collapse border-2 border-gray-200">
              <thead className="bg-[#640037] text-white">
                <tr>
                  <th className="p-3 ">No.</th>
                  <th className="p-3 ">รหัสสินค้า</th>
                  <th className="p-3 ">รายละเอียดสินค้า</th>
                  <th className="p-3 ">Section</th>
                  <th className="p-3 ">ประเภทสินค้า</th>
                  <th className="p-3 ">ยี่ห้อ</th>
                  <th className="p-3 ">ManuelClass</th>
                  <th className="p-3 ">AutoClass</th>
                  <th className="p-3 ">ราคากลาง/หน่วย</th>
                  <th className="p-3 ">ราคาต่ำสุด/หน่วย</th>
                  <th className="p-3 ">Stock</th>
                  <th className="p-3 ">Lead Time (วัน)</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, i) => (
                  <tr key={i} className="border-b hover:bg-amber-50 transition">
                    <td className="p-3">{(page - 1) * offset + i + 1}</td>
                    <td className="p-3">{p.itemCode?.trim() || "-"}</td>
                    <td className="p-3 text-left">
                      {p.description?.trim() || "-"}
                    </td>
                    <td className="p-3">{p.section?.trim() || "-"}</td>
                    <td className="p-3">{p.type?.trim() || "-"}</td>
                    <td className="p-3">{p.brand?.trim() || "-"}</td>
                    <td className="p-3">{p.manualClass?.trim() || "-"}</td>
                    <td className="p-3">{p.autoClass?.trim() || "-"}</td>
                    <td className="p-3 text-right text-[#640037] font-bold">
                      {formatNumber(p.pricePerUnit)}
                    </td>
                    <td className="p-3 text-right text-pink-700 font-semibold">
                      {formatNumber(p.minPricePerUnit)}
                    </td>
                    <td className="p-3 text-right">
                      {formatNumber(p.stockAllStore)}
                    </td>
                    <td className="p-3 text-right text-gray-600">
                      {formatNumber(p.leadTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-pink-100 disabled:opacity-50"
              >
                ← หน้าก่อนหน้า
              </button>
              <span className="text-gray-600 mt-1">
                หน้า {page} 
              </span>
              <button
                disabled={products.length < offset}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-[#640037] text-white rounded hover:bg-pink-700 disabled:opacity-50"
              >
                หน้าถัดไป →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}