import React from "react";
import { useProductByClass } from "../hooks/useProductByClass";

export default function DetailClassA({ setIsDetailsClassA }) {
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjQ3MjUwNDgsImlkIjoidXJtdF8xYzRkMTZmYyIsInJvbGUiOiJyXzA4OGQ4YjdmIn0.AfjeGVTx_usWu3HVaNJ-vZoIHz80bF7Vwj_4v_PVXKfT7xuxSRKFsOMWubo4KTixlEtlID0n3lE1vFIcVeToT5bU_oCyuyMLGpVae_S9kA1JqFbS04wgoKOCyoF12YBM2az0_vRrr93NXFZYxkMVolTWO8zXwWWTx50T-6XgtadV7ahoBp3Ei5ysSCRNhhLI3t2J7Ne2mKCOcBWNpTjCdZbeDb3MUsP4c8ZPboCxg6sTKieov_CjgVC-4M_KCR_fQWA_rzqZ57UcklaV_BaEy3nn747BU0ljKvx4cTadu2aiyGUxsggc3Qdc1YAWm7FfWHHDoioBePDkztYWopENcA";

  // ใช้ hook กลาง (production-grade)
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
    className: "A",
    token,
    initialPageSize: 50,
  });

  const totalPages = Math.ceil(total / offset);
  const formatNumber = (num) =>
    num ? num.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "-";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      <div className="bg-white w-full h-full p-6 shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037]">
            สินค้า Class A
            <p className="text-base text-gray-500 mt-1">หน้าปัจจุบัน: {page}</p>
          </h1>
          <button
            onClick={() => setIsDetailsClassA(false)}
            className="text-4xl text-gray-500 hover:text-[#640037] transition p-1 leading-none"
          >
            &times;
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า, รหัสสินค้า, หรือยี่ห้อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <button className="border-2 px-4 py-2 rounded-lg cursor-pointer hover:bg-amber-100">
            Set
          </button>
          <button className="border-2 px-4 py-2 rounded-lg cursor-pointer hover:bg-amber-100">
            แยกSet
          </button>
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
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-[#640037] text-white">
                <tr>
                  <th className="p-3 text-left border-r border-pink-700">No.</th>
                  <th className="p-3 text-left border-r border-pink-700">รหัสสินค้า</th>
                  <th className="p-3 text-left border-r border-pink-700">รายละเอียดสินค้า</th>
                  <th className="p-3 text-left border-r border-pink-700">ยี่ห้อ</th>
                  <th className="p-3 text-left border-r border-pink-700">ManualClass</th>
                  <th className="p-3 text-left border-r border-pink-700">AutoClass</th>
                  <th className="p-3 text-right border-r border-pink-700">ราคาขาย</th>
                  <th className="p-3 text-right border-r border-pink-700">ราคาขั้นต่ำ</th>
                  <th className="p-3 text-right border-r border-pink-700">สต็อก</th>
                  <th className="p-3 text-right">Lead Time (วัน)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i} className="border-b hover:bg-pink-50 transition">
                    <td className="p-3">{(page - 1) * offset + i + 1}</td>
                    <td className="p-3">{p.itemCode?.trim() || "-"}</td>
                    <td className="p-3">{p.description?.trim() || "-"}</td>
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
                หน้า {page} จาก {totalPages || 1}
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
