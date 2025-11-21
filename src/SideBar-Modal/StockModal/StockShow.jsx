import React, { useState, useMemo } from "react";

// 1. โครงสร้างฟิลด์ (Columns) ของตาราง
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
  { key: "setType", name: "ชุด Set / แตก Set", isAlwaysVisible: false },
  { key: "stockShow", name: "Stock (ตัวโชว์)", isAlwaysVisible: false },
  { key: "stockPhysical", name: "Stock (กายภาพ)", isAlwaysVisible: false },
  { key: "stockDeduct", name: "Stock หักจอง", isAlwaysVisible: false },
  { key: "stockClearance", name: "Stock Clearance", isAlwaysVisible: false },
  { key: "forecashNow", name: "Forecash Now", isAlwaysVisible: false },
  { key: "actualNow", name: "Actual Now", isAlwaysVisible: false },
  { key: "tradeStatus", name: "สถานะ Trade", isAlwaysVisible: false },
  { key: "tradeRemark", name: "Remark Trade / Action", isAlwaysVisible: false },
];

// 2. Mock Data สำหรับสินค้าไม่เคลื่อนไหว (Non-Moving Items)
const mockNonMoveProducts = [
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM502",
    code: "ST88A",
    description: "ชุดเครื่องเขียนลายเทศกาลปีที่แล้ว (Stationery/Season)",
    location: "B02/Aisle-05",
    bestSet: 0,
    forecast: 300,
    actual: 100,
    doh: 300,
    price: 100,
    priceOnline: 79,
    promotionGood: "None",
    setType: "Individual",
    stockShow: 50,
    stockPhysical: 450,
    stockDeduct: 500,
    stockClearance: 100,
    forecashNow: 20,
    actualNow: 15,
    tradeStatus: "Monitor",
    tradeRemark: "Clearance needed",
    isObsolete: false,
  },
  {
    id: "NM503",
    code: "SH35P",
    description: "รองเท้าแตะเบอร์ 35 (สีม่วง) (Fashion/Footwear)",
    location: "C03/Rack-12",
    bestSet: 0,
    forecast: 5,
    actual: 2,
    doh: 600,
    price: 200,
    priceOnline: 150,
    promotionGood: "None",
    setType: "Individual",
    stockShow: 5,
    stockPhysical: 75,
    stockDeduct: 80,
    stockClearance: 0,
    forecashNow: 0,
    actualNow: 0,
    tradeStatus: "Obsolete",
    tradeRemark: "Destroy/Dispose",
    isObsolete: true,
  },
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM501",
    code: "E101X",
    description: "เครื่องเล่น DVD รุ่นเก่า (Electronics/Home)",
    location: "A01/Shelf-01",
    bestSet: 5,
    forecast: 150,
    actual: 50,
    doh: 450,
    price: 1000,
    priceOnline: 890,
    promotionGood: "Free Cable",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 110,
    stockDeduct: 120,
    stockClearance: 0,
    forecashNow: 10,
    actualNow: 5,
    tradeStatus: "Active",
    tradeRemark: "Price Drop Plan",
    isObsolete: true,
  },
  {
    id: "NM504",
    code: "CH02Z",
    description: "สารเคมีบรรจุภัณฑ์เสียหาย (รอทำลาย) (Chemicals/Hazmat)",
    location: "A01/Shelf-01",
    bestSet: 0,
    forecast: 0,
    actual: 0,
    doh: 720,
    price: 100000,
    priceOnline: 0,
    promotionGood: "N/A",
    setType: "Individual",
    stockShow: 0,
    stockPhysical: 5,
    stockDeduct: 5,
    stockClearance: 5,
    forecashNow: 0,
    actualNow: 0,
    tradeStatus: "Disposal",
    tradeRemark: "Hazardous disposal pending",
    isObsolete: true,
  },
  {
    id: "NM505",
    code: "H510",
    description:
      "กระติกน้ำร้อนไฟฟ้า (รุ่นที่เลิกผลิต) (HomeAppliances/Kitchen)",
    location: "B02/Aisle-05",
    bestSet: 2,
    forecast: 10,
    actual: 8,
    doh: 185,
    price: 350,
    priceOnline: 300,
    promotionGood: "None",
    setType: "Set",
    stockShow: 10,
    stockPhysical: 240,
    stockDeduct: 250,
    stockClearance: 50,
    forecashNow: 5,
    actualNow: 2,
    tradeStatus: "Active",
    tradeRemark: "Promote online",
    isObsolete: true,
  },
];

// ดึงรายการ Location ที่ไม่ซ้ำกันทั้งหมด
const allLocations = [...new Set(mockNonMoveProducts.map((p) => p.location))];

export default function StockShow({ setIsStockShow }) {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("all");

  // *** แก้ไขที่นี่: ตั้งค่าให้ visibleColumns รวม key ของคอลัมน์ทั้งหมดเป็นค่า default ***
  const [visibleColumns, setVisibleColumns] = useState(
    TABLE_COLUMNS.map((col) => col.key)
  );

  const pageSize = 10;

  // กรองข้อมูล (รวม Location Filter)
  const filteredProducts = mockNonMoveProducts.filter((product) => {
    const locationMatch =
      selectedLocation === "all" || product.location === selectedLocation;
    const searchMatch =
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    return locationMatch && searchMatch;
  });

  // คำนวณสรุปยอดรวมสำหรับ Location ที่ถูกเลือก
  const stockSummary = useMemo(() => {
    return filteredProducts.reduce(
      (acc, product) => {
        acc.stockShow += product.stockShow || 0;
        acc.stockPhysical += product.stockPhysical || 0;
        acc.stockDeduct += product.stockDeduct || 0;
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
    if (num === null || num === undefined) return "-";
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // กรองเฉพาะคอลัมน์ที่ต้องการแสดง
  const displayedColumns = TABLE_COLUMNS.filter((col) =>
    visibleColumns.includes(col.key)
  );

  // Function ช่วยในการแสดงผลตาม Key
  const renderCellValue = (product, key) => {
    const value = product[key];
    switch (key) {
      case "no":
        // คำนวณลำดับใหม่หลังจาก Filter
        return filteredProducts.findIndex((p) => p.id === product.id) + 1;
      case "doh":
        return (
          <span
            className={`font-bold ${
              value > 365 ? "text-red-700" : "text-orange-600"
            }`}
          >
            {formatNumber(value)}
          </span>
        );
      case "stockDeduct":
      case "stockPhysical":
      case "stockShow":
      case "bestSet":
      case "forecast":
      case "actual":
      case "stockClearance":
      case "forecashNow":
      case "actualNow":
        // จัดรูปแบบตัวเลขสำหรับคอลัมน์ปริมาณและตัวเลข
        return (
          <span className="text-red-700 font-semibold">
            {formatNumber(value)}
          </span>
        );
      case "price":
      case "priceOnline":
        return (
          <span className="font-bold text-[#640037]">
            ฿{formatNumber(value)}
          </span>
        );
      case "tradeStatus":
        const statusClass =
          value === "Active"
            ? "bg-green-100 text-green-800"
            : value === "Monitor"
            ? "bg-amber-100 text-orange-800"
            : "bg-pink-100 text-red-800";
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass} border`}
          >
            {value}
          </span>
        );
      case "description":
        const isObsolete = product.isObsolete;
        return (
          <div>
            <div className="font-medium">{value}</div>
            <span
              className={`px-2 py-1 mt-1 text-xs font-medium rounded-full ${
                isObsolete
                  ? "bg-red-100 text-red-700 border border-red-700"
                  : "bg-yellow-100 text-yellow-700 border border-yellow-700"
              }`}
            >
              {isObsolete ? "ล้าสมัย" : "เฝ้าระวัง"}
            </span>
          </div>
        );
      default:
        return value || "-";
    }
  };

  return (
    // Backdrop/Overlay (ปรับใช้ w-[90%] h-[95%] เพื่อให้ Modal ไม่เต็มจอเกินไป)
    <div className="fixed justify-center items-center inset-0 bg-[#00000080] z-50 flex">
      {/* Modal / Side Panel */}
      <div className="bg-white w-[90%] h-[95%] p-6 shadow-2xl z-50 flex flex-col rounded-xl">
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
        <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4 shrink-0">
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อสินค้า หรือรหัสสินค้า..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // รีเซ็ตหน้าเมื่อค้นหา
            }}
            className="w-full md:w-1/3 p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition"
          />

          <div className="flex flex-wrap justify-end gap-3">
            {/* Dropdown สำหรับเลือก Location */}
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setPage(1); // รีเซ็ตหน้าเมื่อเปลี่ยน Location
              }}
              className="p-2.5 pr-12 border border-gray-300 focus:border-pink-700 focus:ring-pink-700 shadow-sm hover:bg-amber-50 cursor-pointer rounded-lg"
            >
              <option value="all">
                📍 All Locations ({allLocations.length})
              </option>
              {allLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            {/* Dropdown สำหรับ Set Type (คงเดิม) */}
            <select
              defaultValue="select"
              className="p-2.5 pr-12 border border-gray-300 focus:border-pink-700 focus:ring-pink-700 shadow-sm hover:bg-amber-50 cursor-pointer rounded-lg"
            >
              <option className="text-gray-500" value="select">
                Set Type...
              </option>
              <option value="Set">Set</option>
              <option value="Individual">แยกSet</option>
            </select>

            {/* Dropdown สำหรับควบคุมคอลัมน์ (คงเดิม) */}
            <select
              onChange={(e) => {
                const selectedKey = e.target.value;
                if (selectedKey === "select-col") return;
                setVisibleColumns((prev) =>
                  prev.includes(selectedKey)
                    ? prev.filter((key) => key !== selectedKey)
                    : [...prev, selectedKey]
                );
                e.target.value = "select-col";
              }}
              defaultValue="select-col"
              className="p-2.5 pr-12 border border-gray-300 focus:border-pink-700 focus:ring-pink-700 shadow-sm hover:bg-amber-50 cursor-pointer rounded-lg"
            >
              <option className="text-gray-500" value="select-col" disabled>
                Toggle Columns...
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
            className="px-4 py-2 bg-gray-200 rounded hover:bg-pink-100 disabled:opacity-50 transition"
          >
            ← หน้าก่อนหน้า
          </button>
          <span className="text-gray-600 mt-1">
            หน้า {page} / {Math.ceil(filteredProducts.length / pageSize)}
          </span>
          <button
            disabled={page * pageSize >= filteredProducts.length}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-[#640037] text-white rounded hover:bg-pink-700 disabled:opacity-50 transition"
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
