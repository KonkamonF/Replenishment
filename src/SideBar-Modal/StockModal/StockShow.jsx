import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useTradeProducts } from "../../hooks/useTradeProducts";

const KEY_MAP = {
  code: "itemCode",
  description: "Description",
  doh: "DayOnHand_DOH",
  price: "pricePerUnit",
  priceOnline: "minPromotionPrice",
  promotionGood: "itemFree",
  stockShow: "stockShow",
  stockPhysical: "StockReal",
  stockDeduct: "stock_หักจอง",
  stockClearance: "StockClearance",
  tradeStatus: "tradeStatus",
  tradeRemark: "RemarkTrade",
  bestSet: "bestSetMock",
  forecast: "forecastMock",
  actual: "actualMock",
  forecashNow: "forecashNowMock",
  actualNow: "actualNowMock",
  setType: "Type",
  location: "location",
  isObsolete: "isObsoleteMock",
};

// 1. โครงสร้างฟิลด์ (Columns) ของตาราง (ใช้ key เดิม แต่จะ Map ไปยัง KEY_MAP)
const TABLE_COLUMNS = [
  { key: "no", name: "No.", isAlwaysVisible: true },
  { key: "code", name: "ItemCode / Brand / Categories", isAlwaysVisible: true },
  {
    key: "description",
    name: "Description / Class / Department",
    isAlwaysVisible: true,
  },
  { key: "location", name: "Location", isAlwaysVisible: true },
  { key: "bestSet", name: "Best/BestSet", isAlwaysVisible: false },
  { key: "forecast", name: "ยอด Forecast", isAlwaysVisible: false },
  { key: "actual", name: "ยอด Actual", isAlwaysVisible: false },
  { key: "doh", name: "DOH (วัน)", isAlwaysVisible: false },
  { key: "price", name: "ราคากลางต่อหน่วย", isAlwaysVisible: false },
  {
    key: "priceOnline",
    name: "ราคาขาย Online ต่อหน่วย",
    isAlwaysVisible: false,
  },
  { key: "promotionGood", name: "ของแถม", isAlwaysVisible: false },
  { key: "set", name: "ชุด Set / แตก Set", isAlwaysVisible: false },
  { key: "stockShow", name: "Stock (ตัวโชว์)", isAlwaysVisible: false },
  { key: "stockPhysical", name: "Stock (กายภาพ)", isAlwaysVisible: false },
  { key: "stockDeduct", name: "Stock หักจอง", isAlwaysVisible: false },
  { key: "stockClearance", name: "Stock Clearance", isAlwaysVisible: false },
  { key: "forecashNow", name: "Forecash Now", isAlwaysVisible: false },
  { key: "actualNow", name: "ยอด Actual", isAlwaysVisible: false },
  { key: "tradeStatus", name: "สถานะ Trade", isAlwaysVisible: false },
  { key: "tradeRemark", name: "Remark Trade / Action", isAlwaysVisible: false },
];

export default function StockShow({ setIsStockShow }) {
  // State: ใช้ MOCK_PRODUCTS เป็นข้อมูลเริ่มต้น แทนการดึงจาก Hook
  const data = useTradeProducts().data;
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [filters, setFilters] = useState({ setType: "All", status: "All" });

  const [visibleColumns, setVisibleColumns] = useState(
    TABLE_COLUMNS.map((col) => col.key)
  );

  const pageSize = 50;

  const allLocations = useMemo(() => {
    return [...new Set(data.map((p) => p[KEY_MAP.location]))];
  }, [data]);

  // Function จัดการการเปลี่ยนแปลง Filter (รวม search)
  const handleFilterChange = (name, value) => {
    if (name === "search") setSearchTerm(value);
    else setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  // กรองข้อมูล
  const filteredProducts = useMemo(() => {
    let currentData = data;
    
    // 1. Search (Code/Description/Remark)
    const lowerCaseSearch = searchTerm.toLowerCase();
    if (lowerCaseSearch) {
      currentData = currentData.filter(
        (product) =>
          product[KEY_MAP.description]
            .toLowerCase()
            .includes(lowerCaseSearch) ||
          product[KEY_MAP.code].toLowerCase().includes(lowerCaseSearch) ||
          (product[KEY_MAP.tradeRemark] &&
            product[KEY_MAP.tradeRemark]
              .toLowerCase()
              .includes(lowerCaseSearch))
      );
    }

    // 2. Location Filter
    if (selectedLocation !== "all") {
      currentData = currentData.filter(
        (product) => product[KEY_MAP.location] === selectedLocation
      );
    }

    // 3. Set Type Filter (Mock Filter)
    if (filters.setType !== "All") {
      // ใช้ Type ของสินค้าเป็น setType (ถ้ามี)
      currentData = currentData.filter(
        (product) => product[KEY_MAP.setType] === filters.setType
      );
    }

    return currentData;
  }, [searchTerm, selectedLocation, filters, data]);

  // คำนวณสรุปยอดรวมสำหรับ Location ที่ถูกเลือก
  const stockSummary = useMemo(() => {
    return filteredProducts.reduce(
      (acc, product) => {
        // ต้องแปลงค่า String เป็น Number ก่อน
        acc.stockShow += parseFloat(product[KEY_MAP.stockShow]) || 0;
        acc.stockPhysical += parseFloat(product[KEY_MAP.stockPhysical]) || 0;
        acc.stockDeduct += parseFloat(product[KEY_MAP.stockDeduct]) || 0;
        return acc;
      },
      { stockShow: 0, stockPhysical: 0, stockDeduct: 0 }
    );
  }, [filteredProducts]);

  // จำลอง Pagination
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [page, filteredProducts, pageSize]);

  // Function จัดรูปแบบตัวเลขให้มีคอมม่า
  const formatNumber = (num) => {
    // ต้องตรวจสอบและแปลง String เป็น Number ก่อนจัด format
    const numericValue = typeof num === "string" ? parseFloat(num) : num;
    if (
      numericValue === null ||
      numericValue === undefined ||
      isNaN(numericValue)
    )
      return "-";
    return numericValue.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // กรองเฉพาะคอลัมน์ที่ต้องการแสดง
  const displayedColumns = TABLE_COLUMNS.filter((col) =>
    visibleColumns.includes(col.key)
  );

  // Function สำหรับ Column Toggle
  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((key) => key !== column)
        : [...prev, column]
    );
  };

  // Function ช่วยในการแสดงผลตาม Key
  const renderCellValue = (product, key) => {
    // ใช้ KEY_MAP ในการดึงค่าจาก product
    const productKey = KEY_MAP[key];
    const value =
      product[productKey] !== undefined ? product[productKey] : product[key];

    // ฟังก์ชันช่วยแปลงค่า (รองรับค่าว่างและค่าที่ไม่ใช่ตัวเลข)
    const getNumericValue = (val) => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return isNaN(num) ? 0 : num;
    };

    switch (key) {
      case "no":
        return filteredProducts.findIndex((p) => p.id === product.id) + 1;

      case "code":
        // ItemCode / Brand / Categories
        return (
          <div>
            <div className="font-bold text-[#640037]">
              {product[KEY_MAP.code] || "-"}
            </div>
            <div className="text-xs text-gray-500">
              {product.Brand || product.Supply}
            </div>
          </div>
        );

      case "description":
        // Description / Class / Department (ใช้ manualClass และ Description)
        const classValue =
          product.manualClass || product.Class || product.manualClass;
        const descValue = product.Description || product.description;
        // ตรวจสอบ isObsoleteMock หรือ DOH > 365
        const isObsolete =
          product.isObsoleteMock ||
          getNumericValue(product.DayOnHand_DOH) > 365;
        return (
          <div className="text-left">
            <div className="font-medium">{descValue}</div>
            <span className="text-xs text-gray-500">
              Class: {classValue || "-"}
            </span>
            <div className="mt-1">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isObsolete
                    ? "bg-red-100 text-red-700 border border-red-700"
                    : "bg-yellow-100 text-yellow-700 border border-yellow-700"
                } whitespace-nowrap`}
              >
                {isObsolete ? "ล้าสมัย" : "เฝ้าระวัง"}
              </span>
            </div>
          </div>
        );

      case "doh":
        const dohValue = getNumericValue(product[KEY_MAP.doh]);
        return (
          <span
            className={`font-bold ${
              dohValue > 365 ? "text-red-700" : "text-orange-600"
            }`}
          >
            {formatNumber(dohValue)}
          </span>
        );

      case "stockDeduct":
      case "stockPhysical":
      case "stockShow":
      case "stockClearance":
        // จัดรูปแบบตัวเลขสำหรับคอลัมน์ปริมาณและตัวเลข
        return (
          <span className="text-red-700 font-semibold whitespace-nowrap">
            {formatNumber(getNumericValue(value))}
          </span>
        );

      case "price":
      case "priceOnline":
        return (
          <span className="font-bold text-[#640037] whitespace-nowrap">
            ฿{formatNumber(getNumericValue(value))}
          </span>
        );

      case "tradeStatus":
        const status = product.tradeStatus || product.สถานะTrade;
        const statusClass =
          status === "Active"
            ? "bg-green-100 text-green-800"
            : status === "Monitor"
            ? "bg-amber-100 text-orange-800"
            : "bg-pink-100 text-red-800";
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass} border whitespace-nowrap`}
          >
            {status || "-"}
          </span>
        );

      case "tradeRemark":
        return product.RemarkTrade || product.KeyRemarks?.[0] || "-";

      case "setType":
        // ใช้ Type ของสินค้าจาก data field ถ้าไม่มี
        return product.Type || product[KEY_MAP.setType] || "-";

      default:
        // สำหรับคอลัมน์ mock อื่นๆ (bestSet, forecast, actual, forecashNow, actualNow, location, promotionGood)
        const displayValue =
          getNumericValue(value) !== 0
            ? formatNumber(getNumericValue(value))
            : value || "-";
        // สำหรับ Location (ต้องดึงจาก LocationMock)
        if (key === "location") return product[KEY_MAP.location] || "-";

        return displayValue;
    }
  };

  return (
    // Backdrop/Overlay
    <div className="fixed justify-center items-center inset-0 bg-[#00000080] z-50 flex">
      {/* Modal / Side Panel */}
      <div className="bg-white w-[95%] h-[95%] p-6 shadow-2xl z-50 flex flex-col rounded-xl">
        {/* Header และ ปุ่มปิด */}
        <div className="flex justify-between items-start mb-6 border-b pb-4 shrink-0">
          <h1 className="text-3xl font-extrabold text-[#640037]">
            Stock ตัวโชว์ 🛋️
            <p className="text-base font-normal text-gray-600 mt-1">
              รายการสินค้าตัวโชว์ตาม Location
              <span className="ml-4 text-xs text-gray-400">
                หน้าปัจจุบัน : {page} (จำลอง) | แสดง {filteredProducts.length}{" "}
                รายการ
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

        {/* --- Summary Bar --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
          <div className="bg-pink-50 p-4 rounded-lg shadow-md border-l-4 border-[#640037]">
            <p className="text-sm text-gray-500">Stock (ตัวโชว์)</p>
            <p className="text-2xl font-bold text-[#640037]">
              {formatNumber(stockSummary.stockShow)} ชิ้น
            </p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg shadow-md border-l-4 border-red-600">
            <p className="text-sm text-gray-500">Stock (กายภาพ)</p>
            <p className="text-2xl font-bold text-red-600">
              {formatNumber(stockSummary.stockPhysical)} ชิ้น
            </p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <p className="text-sm text-gray-500">Stock หักจอง</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatNumber(stockSummary.stockDeduct)} ชิ้น
            </p>
          </div>
        </div>

        {/* --- Controls --- */}
        <div className="mb-6 shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end p-4 bg-gray-100 rounded-xl shadow-inner border border-gray-200">
            {/* Search Input (Span 2 columns on mobile/tablet) */}
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                ค้นหาสินค้า (Code/Desc/Remark)
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full p-2 pl-9 pr-8 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                {searchTerm && (
                  <button
                    onClick={() => handleFilterChange("search", "")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg font-bold p-1 leading-none"
                    title="ล้างการค้นหา"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Dropdown สำหรับเลือก Location */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="all">📍 All Locations</option>
                {allLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown สำหรับ Set Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                ชุด Set / แตก Set
              </label>
              <select
                value={filters.setType}
                onChange={(e) => handleFilterChange("setType", e.target.value)}
                className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="All">All Set Types</option>
                <option value="Set">Set</option>
                <option value="Individual">Individual</option>
              </select>
            </div>

            {/* Dropdown สำหรับควบคุมคอลัมน์ */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Toggle Columns
              </label>
              <select
                onChange={(e) => toggleColumnVisibility(e.target.value)}
                defaultValue="select-col"
                className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
              >
                <option className="text-gray-500" value="select-col" disabled>
                  Choose column to show/hide
                </option>
                {TABLE_COLUMNS.filter((col) => !col.isAlwaysVisible).map(
                  (col) => (
                    <option key={col.key} value={col.key}>
                      {visibleColumns.includes(col.key)
                        ? "✅ Hide: "
                        : "❌ Show: "}
                      {col.name}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* --- ตารางข้อมูล --- */}
        <div className="flex-grow overflow-x-auto max-h-full overflow-y-auto border border-gray-300 rounded-lg shadow-inner">
          <table className="min-w-full table-auto border-collapse">
            {/* Header: เพิ่ม sticky, top-0, z-10 */}
            <thead className="bg-[#640037] text-white sticky top-0 z-10">
              <tr>
                {displayedColumns.map((col) => (
                  <th
                    key={col.key}
                    className={`p-3 text-sm whitespace-nowrap ${
                      [
                        "doh",
                        "stockDeduct",
                        "price",
                        "stockPhysical",
                        "stockShow",
                        "bestSet",
                        "forecast",
                        "actual",
                        "stockClearance",
                        "forecashNow",
                        "actualNow",
                      ].includes(col.key)
                        ? "text-right"
                        : ["tradeStatus", "no", "setType"].includes(col.key)
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-amber-50 transition"
                  >
                    {displayedColumns.map((col) => (
                      <td
                        key={col.key}
                        className={`p-3 text-sm whitespace-nowrap ${
                          [
                            "doh",
                            "stockDeduct",
                            "price",
                            "stockPhysical",
                            "stockShow",
                            "bestSet",
                            "forecast",
                            "actual",
                            "stockClearance",
                            "forecashNow",
                            "actualNow",
                          ].includes(col.key)
                            ? "text-right"
                            : ["tradeStatus", "no", "setType"].includes(col.key)
                            ? "text-center"
                            : "text-left"
                        }`}
                      >
                        {renderCellValue(product, col.key)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={displayedColumns.length}
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

        {/* --- Pagination --- */}
        <div className="flex justify-center mt-6 space-x-4 shrink-0">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-pink-100 disabled:opacity-50 transition font-medium"
          >
            ← หน้าก่อนหน้า
          </button>
          <span className="text-gray-600 mt-1">
            หน้า {page} / {Math.ceil(filteredProducts.length / pageSize)}
          </span>
          <button
            disabled={page * pageSize >= filteredProducts.length}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-[#640037] text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 transition font-medium"
          >
            หน้าถัดไป →
          </button>
        </div>

        {/* Footer */}
        <div className="h-4 shrink-0"></div>
      </div>
    </div>
  );
}
