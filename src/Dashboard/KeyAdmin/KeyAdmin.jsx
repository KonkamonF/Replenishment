import React, { useState, useMemo } from "react";
import { Search, Eye, EyeOff, ChevronDown } from "lucide-react"; // ใช้ ChevronDown

// --- Mock Data (ชุดข้อมูล Inventory/Trade ที่คุณต้องการ) ---
const mockInventoryData = [
  {
    Code: "06-0005-01",
    Type: "TableTop",
    Class: "B",
    YN_Best_2025: "",
    Brand: "Tecno*",
    Description: "TNS IR 05",
    SubType: "s2il",
    ราคา_กลาง_หน่วย: 1390,
    ราคา_โปรล่าสุด: 1290,
    DayOnHand_DOH: 1413,
    DayOnHand_DOH_Stock2: 376.71,
    TargetSaleUnit_1: 70,
    SaleOutเฉลี่ยวัน: 1.42,
    Stock_จบเหลือจริง: 879,
    SaleOut_มีค68: 43,
    SaleOut_เมย68: 41,
    SaleOut_พค68: 48,
    SaleOut_มิย68: 28,
    Sale_in_Aging_Tier: "Aging1 M",
    สถานะTrade: "Abnormal",
    RemarkTrade: "AC น้อยกว่า FC เกิน 20%",
    DiffPercent: "-90.48%",
    LeadTime: 90,
    ตัดจ่ายเฉลี่ย3เดือน: 6.67,
    // *NEW FIELD* for conversation/tracking
    KeyRemarks: [
      {
        key: 1,
        date: "2025-10-01",
        user: "Admin A",
        text: "สินค้า DOH สูงมาก ควรทำโปรโมชั่นพิเศษด่วน.",
      },
    ],
  },
  {
    Code: "06-0003-01",
    Type: "TableTop",
    Class: "B",
    YN_Best_2025: "Yes",
    Brand: "Tecno*",
    Description: "Table top 1",
    SubType: "s1g1il",
    ราคา_กลาง_หน่วย: 1290,
    ราคา_โปรล่าสุด: 1250,
    DayOnHand_DOH: 310,
    DayOnHand_DOH_Stock2: 148.32,
    TargetSaleUnit_1: 140,
    SaleOutเฉลี่ยวัน: 2.45,
    Stock_จบเหลือจริง: 670,
    SaleOut_มีค68: 64,
    SaleOut_เมย68: 70,
    SaleOut_พค68: 71,
    SaleOut_มิย68: 65,
    Sale_in_Aging_Tier: "No Aging",
    สถานะTrade: "Abnormal",
    RemarkTrade: "AC น้อยกว่า FC เกิน 20%",
    DiffPercent: "-68.12%",
    LeadTime: 80,
    ตัดจ่ายเฉลี่ย3เดือน: 38.2,
    KeyRemarks: [
      {
        key: 1,
        date: "2025-10-02",
        user: "KeyUser B",
        text: "ลูกค้าบ่นเรื่องราคาโปร ไม่ดึงดูดใจเท่าที่ควร.",
      },
      {
        key: 2,
        date: "2025-10-03",
        user: "Admin A",
        text: "รับทราบ. จะพิจารณาราคาโปรโมชั่นใหม่สำหรับเดือนหน้า.",
      },
    ],
  },
  {
    Code: "06-0003-02",
    Type: "TableTop",
    Class: "A",
    YN_Best_2025: "",
    Brand: "Tecno*",
    Description: "Table top 2",
    SubType: "s2g1il",
    ราคา_กลาง_หน่วย: 1450,
    ราคา_โปรล่าสุด: 1390,
    DayOnHand_DOH: 295,
    DayOnHand_DOH_Stock2: 160.44,
    TargetSaleUnit_1: 120,
    SaleOutเฉลี่ยวัน: 2.88,
    Stock_จบเหลือจริง: 710,
    SaleOut_มีค68: 72,
    SaleOut_เมย68: 76,
    SaleOut_พค68: 80,
    SaleOut_มิย68: 78,
    Sale_in_Aging_Tier: "Fresh",
    สถานะTrade: "Normal",
    RemarkTrade: "ยอดขายสอดคล้องกับแผน",
    DiffPercent: "-25.32%",
    LeadTime: 75,
    ตัดจ่ายเฉลี่ย3เดือน: 42.5,
    KeyRemarks: [], // No remarks yet
  },
  {
    Code: "06-0003-03",
    Type: "TableTop",
    Class: "C",
    YN_Best_2025: "",
    Brand: "Tecno*",
    Description: "Table top 3",
    SubType: "s3g2il",
    ราคา_กลาง_หน่วย: 1100,
    ราคา_โปรล่าสุด: 990,
    DayOnHand_DOH: 420,
    DayOnHand_DOH_Stock2: 190.12,
    TargetSaleUnit_1: 90,
    SaleOutเฉลี่ยวัน: 1.95,
    Stock_จบเหลือจริง: 560,
    SaleOut_มีค68: 38,
    SaleOut_เมย68: 42,
    SaleOut_พค68: 39,
    SaleOut_มิย68: 40,
    Sale_in_Aging_Tier: "Aging2 M",
    สถานะTrade: "Abnormal",
    RemarkTrade: "สินค้าเคลื่อนไหวน้อย",
    DiffPercent: "-82.67%",
    LeadTime: 95,
    ตัดจ่ายเฉลี่ย3เดือน: 18.6,
    KeyRemarks: [],
  },
  {
    Code: "06-0003-04",
    Type: "TableTop",
    Class: "B",
    YN_Best_2025: "Yes",
    Brand: "Tecno*",
    Description: "Table top 4",
    SubType: "s4g1il",
    ราคา_กลาง_หน่วย: 1350,
    ราคา_โปรล่าสุด: 1320,
    DayOnHand_DOH: 285,
    DayOnHand_DOH_Stock2: 140.56,
    TargetSaleUnit_1: 150,
    SaleOutเฉลี่ยวัน: 3.12,
    Stock_จบเหลือจริง: 695,
    SaleOut_มีค68: 81,
    SaleOut_เมย68: 79,
    SaleOut_พค68: 85,
    SaleOut_มิย68: 83,
    Sale_in_Aging_Tier: "Fresh",
    สถานะTrade: "Normal",
    RemarkTrade: "สินค้าขายดีตามแผน",
    DiffPercent: "-15.24%",
    LeadTime: 70,
    ตัดจ่ายเฉลี่ย3เดือน: 55.4,
    KeyRemarks: [],
  },
];
// -----------------

// --- Helper Functions (สำหรับแสดงผล) ---
const getDOHStyle = (doh) => {
  if (doh === null || doh === undefined) return "text-gray-500";
  if (doh > 365) return "text-red-600 font-extrabold bg-red-50";
  if (doh > 180) return "text-orange-600 font-bold";
  return "text-green-600 font-bold";
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Abnormal":
      return "bg-red-100 text-red-800 border-red-300";
    case "Normal":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// --- NEW Component: Trade Remark Modal ---
function TradeRemarkModal({ product, onClose, onAddRemark }) {
  const [remarkText, setRemarkText] = useState("");
  const currentUser = "Key User (Admin)"; // จำลองผู้ใช้งานปัจจุบัน

  const handleAddRemark = () => {
    if (remarkText.trim()) {
      const newRemark = {
        date: new Date().toISOString().slice(0, 10), // Format YYYY-MM-DD
        user: currentUser,
        text: remarkText.trim(),
      };
      onAddRemark(product.Code, newRemark);
      setRemarkText("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-2xl">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-[#640037]">
            บันทึกการสื่อสาร/ติดตาม: {product.Code}
          </h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-red-500"
          >
            &times;
          </button>
        </div>

        <p className="text-gray-700 mb-4 font-medium">{product.Description}</p>

        {/* Remark History */}
        <div className="h-64 overflow-y-auto mb-4 space-y-3 p-2 border rounded-lg bg-gray-50">
          {product.KeyRemarks && product.KeyRemarks.length > 0 ? (
            product.KeyRemarks.map((remark, index) => (
              <div
                key={index}
                className="border-l-4 border-pink-400 pl-3 py-1 bg-white rounded shadow-sm"
              >
                <p className="font-semibold text-sm">
                  {remark.user}
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    ({remark.date})
                  </span>
                </p>
                <p className="text-gray-800">{remark.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center pt-8">
              ยังไม่มีบันทึกการสื่อสารเฉพาะกิจ
            </p>
          )}
        </div>

        {/* New Remark Input */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-gray-700 font-semibold mb-2">
            เพิ่มบันทึกใหม่ ในนาม: {currentUser}
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-300"
            rows="3"
            placeholder="พิมพ์บันทึกการสื่อสารหรือข้อเสนอแนะ..."
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
          ></textarea>
          <button
            onClick={handleAddRemark}
            className="mt-2 w-full px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition shadow-md"
            disabled={!remarkText.trim()}
          >
            บันทึกการสื่อสาร
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function InventoryTradeMonitorWithFilters() {
  const [data, setData] = useState(mockInventoryData);
  const [filters, setFilters] = useState({
    search: "",
    brand: "All",
    class: "All",
    best2025: "All",
    tradeStatus: "All",
  });
  const [modalRemarkProduct, setModalRemarkProduct] = useState(null); // NEW State

  // Unique Filter Options
  const uniqueBrands = useMemo(
    () => ["All", ...new Set(data.map((item) => item.Brand))],
    [data]
  );
  const uniqueClasses = useMemo(
    () => ["All", ...new Set(data.map((item) => item.Class))],
    [data]
  );
  const uniqueBest2025 = useMemo(() => ["All", "Yes", "No"], []);
  const uniqueTradeStatus = useMemo(
    () => ["All", ...new Set(data.map((item) => item.สถานะTrade))],
    [data]
  );

  // Filtered Data Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Search Filter (Code, Description, RemarkTrade)
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        item.Code.toLowerCase().includes(searchTerm) ||
        item.Description.toLowerCase().includes(searchTerm) ||
        item.RemarkTrade.toLowerCase().includes(searchTerm);

      // 2. Brand Filter
      const matchesBrand =
        filters.brand === "All" || item.Brand === filters.brand;

      // 3. Class Filter
      const matchesClass =
        filters.class === "All" || item.Class === filters.class;

      // 4. Best 2025 Filter
      const matchesBest2025 =
        filters.best2025 === "All" ||
        (filters.best2025 === "Yes" && item.YN_Best_2025 === "Yes") ||
        (filters.best2025 === "No" && item.YN_Best_2025 !== "Yes");

      // 5. Trade Status Filter
      const matchesTradeStatus =
        filters.tradeStatus === "All" ||
        item.สถานะTrade === filters.tradeStatus;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesClass &&
        matchesBest2025 &&
        matchesTradeStatus
      );
    });
  }, [filters, data]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // NEW Function: Open Remark Modal
  const handleOpenRemarkModal = (product) => {
    setModalRemarkProduct(product);
  };

  // NEW Function: Add new remark to a product
  const handleAddRemark = (productCode, newRemark) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.Code === productCode
          ? { ...item, KeyRemarks: [...(item.KeyRemarks || []), newRemark] }
          : item
      )
    );
    // Update modal state to reflect new data immediately
    setModalRemarkProduct((prevProduct) =>
      prevProduct.Code === productCode
        ? {
            ...prevProduct,
            KeyRemarks: [...(prevProduct.KeyRemarks || []), newRemark],
          }
        : prevProduct
    );
    // ใช้ Modal แทน alert ในแอปจริง
    console.log(`บันทึกการสื่อสารสำหรับ ${productCode} สำเร็จ!`);
  };

  return (
    <div className="p-8 bg-white shadow-2xl rounded-xl">
      {/* --- Header & Summary --- */}
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
          Key Account
        </h1>
        <p className="text-gray-500">
          ข้อมูลคงคลัง (Stock) และยอดขาย (Sale Out) พร้อมระบบค้นหาและกรองข้อมูล
        </p>
      </header>

      {/* --- Filters & Search Bar --- */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8 items-end p-4 bg-pink-50 rounded-lg border border-pink-200">
        {/* Search Bar */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            ค้นหาสินค้า (Code/Desc/Remark)
          </label>
          <input
            type="text"
            placeholder="ค้นหา..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Brand
          </label>
          {/* --- MODIFIED: Add Chevron Down --- */}
          <div className="relative">
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm appearance-none"
            >
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {/* --- END MODIFIED --- */}
        </div>

        {/* Class Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Class
          </label>
          {/* --- MODIFIED: Add Chevron Down --- */}
          <div className="relative">
            <select
              value={filters.class}
              onChange={(e) => handleFilterChange("class", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm appearance-none"
            >
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {/* --- END MODIFIED --- */}
        </div>

        {/* Best 2025 Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            YN Best 2025
          </label>
          {/* --- MODIFIED: Add Chevron Down --- */}
          <div className="relative">
            <select
              value={filters.best2025}
              onChange={(e) => handleFilterChange("best2025", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm appearance-none"
            >
              {uniqueBest2025.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "" ? "(Blank)" : opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {/* --- END MODIFIED --- */}
        </div>

        {/* Trade Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            สถานะ Trade
          </label>
          {/* --- MODIFIED: Add Chevron Down --- */}
          <div className="relative">
            <select
              value={filters.tradeStatus}
              onChange={(e) => handleFilterChange("tradeStatus", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm appearance-none"
            >
              {uniqueTradeStatus.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {/* --- END MODIFIED --- */}
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600 font-medium">
        แสดงผล **{filteredData.length}** รายการ จากทั้งหมด **{data.length}**
        รายการ
      </p>

      {/* --- Data Table Container --- */}
      <div className="overflow-x-auto shadow-xl h-[370px] rounded-xl">
        <table className="min-w-full table-auto border-collapse bg-white ">
          <thead className="bg-[#640037] text-white sticky top-0">
            <tr>
              <th className="p-3 text-left w-[100px]">Code/Brand</th>
              <th className="p-3 text-left w-[250px] min-w-[250px]">
                Description/Type
              </th>
              <th className="p-3 text-right w-[100px]">Stock (เหลือจริง)</th>
              <th className="p-3 text-right w-[100px]">ยอด Forecast</th>
              <th className="p-3 text-right w-[100px] font-extrabold">
                DOH (วัน)
              </th>
              <th className="p-3 text-center w-[120px]">สถานะ Trade</th>
              <th className="p-3 text-left w-[200px]">Remark Trade / Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.Code}
                  className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
                >
                  {/* Code/Brand */}
                  <td className="p-3 text-left font-mono text-sm">
                    <span className="font-bold text-[#640037]">
                      {item.Code}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">{item.Brand}</span>
                  </td>

                  {/* Description/Type */}
                  <td className="p-3 text-left font-semibold text-gray-700">
                    {item.Description}
                    <span
                      className={`ml-2 text-xs font-normal text-white px-2 py-0.5 rounded-full ${
                        item.Class === "A" ? "bg-orange-500" : "bg-pink-500"
                      }`}
                    >
                      Class {item.Class}
                    </span>
                    <br />
                    <span className="text-xs text-gray-400">
                      {item.Type} ({item.SubType})
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="p-3 text-right font-bold text-lg">
                    {item.Stock_จบเหลือจริง.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold text-lg">
                    {item.Stock_จบเหลือจริง.toLocaleString() - 25}
                  </td>

                  {/* DOH (วัน) */}
                  <td
                    className={`p-3 text-right font-extrabold text-lg ${getDOHStyle(
                      item.DayOnHand_DOH_Stock2
                    )}`}
                  >
                    {(item.DayOnHand_DOH_Stock2 || 0)
                      .toFixed(0)
                      .toLocaleString()}
                  </td>

                  {/* สถานะ Trade */}
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(
                        item.สถานะTrade
                      )}`}
                    >
                      {item.สถานะTrade}
                    </span>
                    {item.DiffPercent && (
                      <p
                        className={`text-xs mt-1 font-bold ${
                          item.DiffPercent.startsWith("-")
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {item.DiffPercent}
                      </p>
                    )}
                  </td>

                  {/* Remark Trade / Action (UPDATED) */}
                  <td className="p-3 text-left text-sm max-w-xs whitespace-normal text-gray-600">
                    <p className="text-xs mb-1 italic truncate">
                      {item.RemarkTrade || "-"}
                    </p>
                    <button
                      onClick={() => handleOpenRemarkModal(item)}
                      className={`px-3 py-1 text-xs rounded-lg shadow-md transition font-medium
							${
                          item.KeyRemarks && item.KeyRemarks.length > 0
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      บันทึก/ดูการสื่อสาร (
                      {item.KeyRemarks ? item.KeyRemarks.length : 0})
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7" // Changed colspan to 7 to cover all columns
                  className="p-6 text-center text-lg text-gray-500"
                >
                  ไม่พบข้อมูลสินค้าที่ตรงกับเงื่อนไขการกรอง
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        <p>
          💡 **คำอธิบาย DOH (Days On Hand):**
          <span className="text-red-600 font-extrabold ml-2">
            DOH &gt; 365 วัน
          </span>{" "}
          (Stock ล้นมาก) |
          <span className="text-orange-600 font-bold ml-2">
            180 &lt; DOH &lt; 365 วัน
          </span>{" "}
          (ควรระวัง) |
          <span className="text-green-600 font-bold ml-2">
            DOH &lt; 180 วัน
          </span>{" "}
          (ปกติ)
        </p>
      </div>

      {/* --- TRADE REMARK MODAL --- */}
      {modalRemarkProduct && (
        <TradeRemarkModal
          product={modalRemarkProduct}
          onClose={() => setModalRemarkProduct(null)}
          onAddRemark={handleAddRemark}
        />
      )}
    </div>
  );
}
