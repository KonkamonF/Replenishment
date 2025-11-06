import React from "react";
import { useProductByClass } from "../hooks/useProductByClass";

export default function DetailClassB({ setIsDetailsClassB }) {
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
    className: "B",
    token,
    initialPageSize: 50,
  });

  const formatNumber = (num) =>
    num ? num.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "-";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      <div className="bg-white w-full h-full p-6 shadow-2xl z-50 overflow-y-auto">
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037]">
            สินค้า Class B
            <p className="text-base text-gray-600 mt-1">หน้าปัจจุบัน : {page}</p>
          </h1>
          <button
            onClick={() => setIsDetailsClassB(false)}
            className="text-4xl text-gray-500 hover:text-[#640037] transition p-1 leading-none"
          >
            &times;
          </button>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า, รหัสสินค้า, หรือยี่ห้อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-screen p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition"
          />
          <div className="flex justify-end gap-2">
            <select
              defaultValue="select"
              className="p-2.5 pr-24 border border-gray-300 focus:border-pink-700 focus:ring-pink-700 shadow-sm hover:bg-amber-50 cursor-pointer rounded-lg"
            >
              <option value="select">Select...</option>
              <option value="set">Set</option>
              <option value="nonSet">แยกSet</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-10 animate-pulse">
            กำลังโหลดข้อมูล...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 py-10">
            โหลดข้อมูลไม่สำเร็จ: {error}
          </p>
        ) : (
          <>
            <table className="min-w-full border-collapse border-2 border-gray-200">
              <thead className="bg-[#640037] text-white">
                <tr>
                  <th className="p-3">No.</th>
                  <th className="p-3">รหัสสินค้า</th>
                  <th className="p-3">รายละเอียดสินค้า</th>
                  <th className="p-3">ยี่ห้อ</th>
                  <th className="p-3">ราคากลาง/หน่วย</th>
                  <th className="p-3">สต็อก</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i} className="border-b hover:bg-amber-50 transition">
                    <td className="p-3">{(page - 1) * offset + i + 1}</td>
                    <td className="p-3">{p.itemCode}</td>
                    <td className="p-3 text-left">{p.description}</td>
                    <td className="p-3">{p.brand}</td>
                    <td className="p-3 text-right text-[#640037] font-bold">
                      {formatNumber(p.pricePerUnit)}
                    </td>
                    <td className="p-3 text-right text-pink-700 font-semibold">
                      {formatNumber(p.stockAllStore)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
