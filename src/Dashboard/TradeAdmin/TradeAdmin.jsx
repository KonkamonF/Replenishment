// InventoryTradeMonitor.jsx

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Eye, EyeOff, ChevronDown, Upload } from "lucide-react";
import StockShowModal from "../SupperAdmin/StockModal/StockShow";
import TradeCommunicationModal from "../SupperAdmin/StockModal/CommunicateCard";
// --------------------------------------------------------

// --- Helper Functions (สำหรับแสดงผล) ---
const formatCurrency = (amount) => `฿${(amount || 0).toLocaleString()}`;

const getDOHStyle = (doh) => {
  if (doh === null || doh === undefined) return "text-gray-500";
  if (doh > 365) return "text-red-600 font-extrabold bg-red-50";
  if (doh > 180) return "text-orange-600 font-bold";
  return "text-green-600 font-bold";
};

// สถานะ Trade Style
const getStatusStyle = (status) => {
  switch (status) {
    case "Abnormal":
      return "bg-red-100 text-red-800 border-red-300";
    case "Normal":
      return "bg-green-100 text-green-800 border-green-300";
    case "Resolved":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// Format Number with commas
const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return "-";
  return num.toLocaleString("en-US", { maximumFractionDigits: decimals });
};

// --- Mock Data (ชุดข้อมูล Inventory/Trade) ---
const mockInventoryData = [
  // ข้อมูลเดิม
  { Code: "06-0005-01", Type: "TableTop", Class: "B", YN_Best_2025: "", Brand: "Tecno*", Description: "TNS IR 05", SubType: "set", ราคา_กลาง_หน่วย: 1390, ราคา_โปรล่าสุด: 1290, DayOnHand_DOH: 1413, DayOnHand_DOH_Stock2: 376.71, TargetSaleUnit_1: 70, SaleOutเฉลี่ยวัน: 1.42, Stock_จบเหลือจริง: 879, SaleOut_มีค68: 43, SaleOut_เมย68: 41, SaleOut_พค68: 48, SaleOut_มิย68: 28, Sale_in_Aging_Tier: "Aging1 M", สถานะTrade: "Abnormal", RemarkTrade: "AC น้อยกว่า FC เกิน 20%", DiffPercent: "-90.48%", LeadTime: 90, ตัดจ่ายเฉลี่ย3เดือน: 6.67, KeyRemarks: [{ key: 1, date: "2025-10-01", user: "Admin A", text: "สินค้า DOH สูงมาก ควรทำโปรโมชั่นพิเศษด่วน." }] },
  // ... (Mock Data อื่น ๆ ที่คุณมี) ...
  { Code: "06-0003-04", Type: "TableTop", Class: "B", YN_Best_2025: "Yes", Brand: "Tecno*", Description: "Table top 4", SubType: "non set", ราคา_กลาง_หน่วย: 1350, ราคา_โปรล่าสุด: 1320, DayOnHand_DOH: 285, DayOnHand_DOH_Stock2: 140.56, TargetSaleUnit_1: 150, SaleOutเฉลี่ยวัน: 3.12, Stock_จบเหลือจริง: 695, SaleOut_มีค68: 81, SaleOut_เมย68: 79, SaleOut_พค68: 85, SaleOut_มิย68: 83, Sale_in_Aging_Tier: "Fresh", สถานะTrade: "Normal", RemarkTrade: "สินค้าขายดีตามแผน", DiffPercent: "-15.24%", LeadTime: 70, ตัดจ่ายเฉลี่ย3เดือน: 55.4, KeyRemarks: [] },
  { Code: "06-0003-05", Type: "TableTop", Class: "B", YN_Best_2025: "Yes", Brand: "Tecno*", Description: "Table top 5", SubType: "non set", ราคา_กลาง_หน่วย: 1350, ราคา_โปรล่าสุด: 1320, DayOnHand_DOH: 285, DayOnHand_DOH_Stock2: 140.56, TargetSaleUnit_1: 150, SaleOutเฉลี่ยวัน: 3.12, Stock_จบเหลือจริง: 695, SaleOut_มีค68: 81, SaleOut_เมย68: 79, SaleOut_พค68: 85, SaleOut_มิย68: 83, Sale_in_Aging_Tier: "Fresh", สถานะTrade: "Normal", RemarkTrade: "สินค้าขายดีตามแผน", DiffPercent: "-15.24%", LeadTime: 70, ตัดจ่ายเฉลี่ย3เดือน: 55.4, KeyRemarks: [] },
  { Code: "06-0003-06", Type: "TableTop", Class: "B", YN_Best_2025: "Yes", Brand: "Tecno*", Description: "Table top 6", SubType: "non set", ราคา_กลาง_หน่วย: 1350, ราคา_โปรล่าสุด: 1320, DayOnHand_DOH: 285, DayOnHand_DOH_Stock2: 140.56, TargetSaleUnit_1: 150, SaleOutเฉลี่ยวัน: 3.12, Stock_จบเหลือจริง: 695, SaleOut_มีค68: 81, SaleOut_เมย68: 79, SaleOut_พค68: 85, SaleOut_มิย68: 83, Sale_in_Aging_Tier: "Fresh", สถานะTrade: "Normal", RemarkTrade: "สินค้าขายดีตามแผน", DiffPercent: "-15.24%", LeadTime: 70, ตัดจ่ายเฉลี่ย3เดือน: 55.4, KeyRemarks: [] },
  { Code: "06-0003-07", Type: "TableTop", Class: "B", YN_Best_2025: "Yes", Brand: "Tecno*", Description: "Table top 7", SubType: "non set", ราคา_กลาง_หน่วย: 1350, ราคา_โปรล่าสุด: 1320, DayOnHand_DOH: 285, DayOnHand_DOH_Stock2: 140.56, TargetSaleUnit_1: 150, SaleOutเฉลี่ยวัน: 3.12, Stock_จบเหลือจริง: 695, SaleOut_มีค68: 81, SaleOut_เมย68: 79, SaleOut_พค68: 85, SaleOut_มิย68: 83, Sale_in_Aging_Tier: "Fresh", สถานะTrade: "Normal", RemarkTrade: "สินค้าขายดีตามแผน", DiffPercent: "-15.24%", LeadTime: 70, ตัดจ่ายเฉลี่ย3เดือน: 55.4, KeyRemarks: [] },
  { Code: "06-0003-08", Type: "TableTop", Class: "B", YN_Best_2025: "Yes", Brand: "Tecno*", Description: "Table top 8", SubType: "non set", ราคา_กลาง_หน่วย: 1350, ราคา_โปรล่าสุด: 1320, DayOnHand_DOH: 285, DayOnHand_DOH_Stock2: 140.56, TargetSaleUnit_1: 150, SaleOutเฉลี่ยวัน: 3.12, Stock_จบเหลือจริง: 695, SaleOut_มีค68: 81, SaleOut_เมย68: 79, SaleOut_พค68: 85, SaleOut_มิย68: 83, Sale_in_Aging_Tier: "Fresh", สถานะTrade: "Normal", RemarkTrade: "สินค้าขายดีตามแผน", DiffPercent: "-15.24%", LeadTime: 70, ตัดจ่ายเฉลี่ย3เดือน: 55.4, KeyRemarks: [] },
  { Code: "06-0003-09", Type: "TableTop", Class: "B", YN_Best_2025: "Yes", Brand: "Tecno*", Description: "Table top 9", SubType: "non set", ราคา_กลาง_หน่วย: 1350, ราคา_โปรล่าสุด: 1320, DayOnHand_DOH: 285, DayOnHand_DOH_Stock2: 140.56, TargetSaleUnit_1: 150, SaleOutเฉลี่ยวัน: 3.12, Stock_จบเหลือจริง: 695, SaleOut_มีค68: 81, SaleOut_เมย68: 79, SaleOut_พค68: 85, SaleOut_มิย68: 83, Sale_in_Aging_Tier: "Fresh", สถานะTrade: "Normal", RemarkTrade: "สินค้าขายดีตามแผน", DiffPercent: "-15.24%", LeadTime: 70, ตัดจ่ายเฉลี่ย3เดือน: 55.4, KeyRemarks: [] },
  { Code: "06-0003-10", Type: "TableTop", Class: "B", YN_Best_2025: "Yes", Brand: "Tecno*", Description: "Table top 10", SubType: "non set", ราคา_กลาง_หน่วย: 1350, ราคา_โปรล่าสุด: 1320, DayOnHand_DOH: 285, DayOnHand_DOH_Stock2: 140.56, TargetSaleUnit_1: 150, SaleOutเฉลี่ยวัน: 3.12, Stock_จบเหลือจริง: 695, SaleOut_มีค68: 81, SaleOut_เมย68: 79, SaleOut_พค68: 85, SaleOut_มิย68: 83, Sale_in_Aging_Tier: "Fresh", สถานะTrade: "Normal", RemarkTrade: "สินค้าขายดีตามแผน", DiffPercent: "-15.24%", LeadTime: 70, ตัดจ่ายเฉลี่ย3เดือน: 55.4, KeyRemarks: [] },
  { Code: "06-0003-11", Type: "TableTop", Class: "B", YN_Best_2025: "Yes", Brand: "Tecno*", Description: "Table top 11", SubType: "non set", ราคา_กลาง_หน่วย: 1350, ราคา_โปรล่าสุด: 1320, DayOnHand_DOH: 285, DayOnHand_DOH_Stock2: 140.56, TargetSaleUnit_1: 150, SaleOutเฉลี่ยวัน: 3.12, Stock_จบเหลือจริง: 695, SaleOut_มีค68: 81, SaleOut_เมย68: 79, SaleOut_พค68: 85, SaleOut_มิย68: 83, Sale_in_Aging_Tier: "Fresh", สถานะTrade: "Normal", RemarkTrade: "สินค้าขายดีตามแผน", DiffPercent: "-15.24%", LeadTime: 70, ตัดจ่ายเฉลี่ย3เดือน: 55.4, KeyRemarks: [] },
];
// -----------------

// --- LIST OF ALL COLUMNS ---
const ALL_COLUMNS = [
  { key: "No", name: "No.", field: null, isAlwaysVisible: true },
  { key: "Code", name: "ItemCode / Brand", field: "Code", isAlwaysVisible: true },
  { key: "Description", name: "Description / Class", field: "Description", isAlwaysVisible: true },
  { key: "Best", name: "Best/BestSet", field: "YN_Best_2025", isAlwaysVisible: false },
  { key: "Forecast", name: "ยอด Forecast", field: "TargetSaleUnit_1", isAlwaysVisible: false },
  { key: "Actual", name: "ยอด Actual", field: "SaleOut_เมย68", isAlwaysVisible: false },
  { key: "DOH", name: "DOH (วัน)", field: "DayOnHand_DOH_Stock2", isAlwaysVisible: false },
  { key: "SetType", name: "ชุด Set / แตก Set", field: "SubType", isAlwaysVisible: false },
  { key: "Stock_Physical", name: "Stock (กายภาพ)", field: "Stock_จบเหลือจริง", isAlwaysVisible: false },
  { key: "Stock_Show", name: "Stock (ตัวโชว์)", field: "Stock_จบเหลือจริง", isAlwaysVisible: false }, // Mocked field
  { key: "TradeStatus", name: "สถานะ Trade", field: "สถานะTrade", isAlwaysVisible: false },
  { key: "TradeRemark", name: "Remark Trade / Action", field: "RemarkTrade", isAlwaysVisible: false },
];
// -----------------------------------------------------------------


// --- Column Toggle Dropdown Component ---
function ColumnToggleDropdown({ hiddenColumns, toggleColumnVisibility }) {
  const toggleableColumns = ALL_COLUMNS.filter((col) => !col.isAlwaysVisible);
  const hasHiddenColumns = hiddenColumns.length > 0;
  const hiddenCount = hiddenColumns.length;
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleItemClick = (key) => toggleColumnVisibility(key);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left z-10" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex justify-center items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 shadow-md 
          ${hasHiddenColumns
            ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
            : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
          }`}
        aria-expanded={open ? "true" : "false"}
      >
        {open || hasHiddenColumns ? (<EyeOff className="w-4 h-4" />) : (<Eye className="w-4 h-4" />)}
        {`Show/Hide Columns ${hiddenCount > 0 ? `(${hiddenCount})` : ""}`}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {open && (
        <div
          id="column-menu"
          className="origin-top-right absolute right-0 mt-2 w-72 rounded-lg shadow-2xl bg-white ring-1 ring-pink-800 ring-opacity-20 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
          <div className="p-2 max-h-60 overflow-y-auto">
            <p className="px-3 py-1 text-xs text-gray-500 font-bold border-b mb-1">
              Toggleable Columns
            </p>
            {toggleableColumns.map((col) => (
              <div
                key={col.key}
                onClick={() => handleItemClick(col.key)}
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-pink-100 cursor-pointer transition duration-100 rounded-md"
                role="menuitem"
              >
                <span className="font-medium">{col.name}</span>
                {hiddenColumns.includes(col.key) ? (<EyeOff className="w-4 h-4 text-red-500" />) : (<Eye className="w-4 h-4 text-green-500" />)}
              </div>
            ))}
            <div className="px-3 py-2 text-xs text-gray-400 border-t mt-2">
              คอลัมน์ ItemCode และ Description ถูกตั้งค่าให้แสดงเสมอ
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ------------------------------------------

// --- Main Component ---
export default function InventoryTradeMonitor() {
  const [data, setData] = useState(mockInventoryData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isStockShow, setIsStockShow] = useState(false); // State สำหรับควบคุม StockShowModal
  const [filters, setFilters] = useState({
    search: "",
    brand: "All",
    class: "All",
    best2025: "All",
    tradeStatus: "All",
    set: "All",
  });
  // State: สำหรับจัดการคอลัมน์ที่ถูกซ่อน (Array of keys)
  const [hiddenColumns, setHiddenColumns] = useState([]); 
  // State: Modal Data สำหรับ TradeCommunicationModal
  const [modalData, setModalData] = useState({
    comment: "",
    newStatus: "Pending",
  });
  
  const CURRENT_USER = "Trade Planner (Key)";

  // --- Column Visibility Handlers ---
  const toggleColumnVisibility = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };
  const isColumnHidden = (key) => hiddenColumns.includes(key);

  // --- Filter Handlers ---
  const handleFilterChange = (name, value) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  // Unique Filter Options (ใช้จากข้อมูลจริง)
  const uniqueBrands = useMemo(
    () => ["All", ...new Set(data.map((item) => item.Brand))],
    [data]
  );
  const uniqueClasses = useMemo(
    () => ["All", ...new Set(data.map((item) => item.Class))],
    [data]
  );
  const uniqueBest2025 = useMemo(() => ["All", "Yes", ""], []);
  const uniqueTradeStatus = useMemo(
    () => ["All", ...new Set(data.map((item) => item.สถานะTrade))],
    [data]
  );
  const uniqueSets = useMemo(
    () => ["All", ...new Set(data.map((item) => item.Type))],
    [data]
  );

  // --- Filtered Data Logic ---
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchTerm = filters.search.toLowerCase();
      const bestValue = item.YN_Best_2025 || "";
      
      const matchesSearch =
        item.Code.toLowerCase().includes(searchTerm) ||
        item.Description.toLowerCase().includes(searchTerm) ||
        (item.RemarkTrade &&
          item.RemarkTrade.toLowerCase().includes(searchTerm));
      const matchesBrand =
        filters.brand === "All" || item.Brand === filters.brand;
      const matchesClass =
        filters.class === "All" || item.Class === filters.class;
      const matchesBest2025 =
        filters.best2025 === "All" || filters.best2025 === bestValue;
      const matchesTradeStatus =
        filters.tradeStatus === "All" ||
        item.สถานะTrade === filters.tradeStatus;
      const matchesSet = filters.set === "All" || item.Type === filters.set;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesClass &&
        matchesBest2025 &&
        matchesTradeStatus &&
        matchesSet
      );
    });
  }, [filters, data]);
  // --- END Filtered Data Logic ---

  // --- Modal Logic (Trade Communication) ---
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalData({ comment: "", newStatus: item.สถานะTrade || "Pending" });
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalData({ comment: "", newStatus: "Pending" });
  };
  
  const handleModalDataChange = (name, value) =>
    setModalData((prev) => ({ ...prev, [name]: value }));
  
  const handleSubmitAction = () => {
    if (!selectedItem || !modalData.comment.trim()) {
      console.error("กรุณาเพิ่มข้อความ Remark ก่อนทำการบันทึก Action");
      return;
    }

    const newRemark = {
      key: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      user: CURRENT_USER,
      status: modalData.newStatus,
      text: modalData.comment.trim(),
    };

    const updatedData = data.map((item) =>
      item.Code === selectedItem.Code
        ? {
            ...item,
            สถานะTrade: modalData.newStatus,
            RemarkTrade: modalData.comment.trim(),
            KeyRemarks: [...(item.KeyRemarks || []), newRemark],
          }
        : item
    );

    setData(updatedData);
    handleCloseModal();
  };

  // --- Function to open StockShowModal ---
  const handleShowStockModal = (item) => {
    setSelectedItem(item);
    setIsStockShow(true);
  };
  // ------------------------------------------

  // --- Summary Metrics calculation ---
  const totalSKUs = filteredData.length;
  const totalStock = filteredData.reduce(
    (sum, item) => sum + (item.Stock_จบเหลือจริง || 0),
    0
  );
  // คำนวณ Avg DOH โดยใช้ Stock_จบเหลือจริงเป็นตัวถ่วงน้ำหนัก
  const totalStockWeightedDOH = filteredData.reduce((sum, item) => {
    return sum + (item.Stock_จบเหลือจริง * (item.DayOnHand_DOH_Stock2 || 0));
  }, 0);

  const avgDOH = totalStock > 0 ? totalStockWeightedDOH / totalStock : 0;
  
  const abnormalCount = filteredData.filter(
    (item) => item.สถานะTrade === "Abnormal"
  ).length;

  // คำนวณ ColSpan สำหรับแถบ 'ไม่พบข้อมูล'
  const visibleColumnCount = ALL_COLUMNS.filter(
    (col) => !isColumnHidden(col.key)
  ).length;

  // --- Table Cell Renderer ---
  const renderCell = (item, col, index) => {
    // 1. No.
    if (col.key === "No") return (<td className="p-3">{index + 1}</td>);
    
    // 2. ItemCode / Brand
    if (col.key === "Code") {
      return (
        <td className="p-3 font-mono text-sm border-r border-gray-200 text-left min-w-[120px]">
          <span className="font-bold text-[#640037] block">{item.Code}</span>
          <span className="text-xs text-gray-500">{item.Brand}</span>
        </td>
      );
    }
    
    // 3. Description / Class
    if (col.key === "Description") {
      return (
        <td className="p-3 font-semibold text-gray-700 border-r border-gray-200 text-left min-w-[200px]">
          <span className="block">{item.Description}</span>
          <span
            className={`ml-1 text-xs font-normal text-white px-2 py-0.5 rounded-full inline-block ${
              item.Class === "A" ? "bg-orange-500" : "bg-pink-500"
            }`}
          >
            Class {item.Class}
          </span>
          <span className="text-xs text-gray-400 block mt-1">
            {item.Type} ({item.SubType})
          </span>
        </td>
      );
    }
    
    // 4. Best/BestSet
    if (col.key === "Best") {
      return (
        <td className="p-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              item.YN_Best_2025 === "Yes"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {item.YN_Best_2025 || "No"}
          </span>
        </td>
      );
    }
    
    // 5. ยอด Forecast
    if (col.key === "Forecast")
      return (
        <td className="p-3 font-bold text-lg border-r border-gray-200 text-right">
          {formatNumber(item.TargetSaleUnit_1)}
        </td>
      );
      
    // 6. ยอด Actual
    if (col.key === "Actual")
      return (
        <td className="p-3 font-semibold text-lg border-r border-gray-200 text-right text-blue-600">
          {formatNumber(item.SaleOut_เมย68)}
        </td>
      );
      
    // 7. DOH (วัน)
    if (col.key === "DOH") {
      return (
        <td
          className={`p-3 font-extrabold text-lg border-r border-gray-200 ${getDOHStyle(
            item.DayOnHand_DOH_Stock2
          )} text-right`}
        >
          {formatNumber(item.DayOnHand_DOH_Stock2, 0)}
        </td>
      );
    }
    
    // 8. ชุด Set / แตก Set
    if (col.key === "SetType")
      return (
        <td className="p-3 text-sm text-gray-600">{item.SubType || "-"}</td>
      );
      
    // 9. Stock (กายภาพ)
    if (col.key === "Stock_Physical")
      return (
        <td className="p-3 font-bold text-lg border-r border-gray-200 text-right">
          {formatNumber(item.Stock_จบเหลือจริง)}
        </td>
      );
      
    // 10. Stock (ตัวโชว์) with Button
    if (col.key === "Stock_Show") {
      const stockShowValue = formatNumber(
        Math.round((item.Stock_จบเหลือจริง || 0) * 0.1)
      );
      return (
        <td className="p-3 text-sm text-gray-500 text-center">
          <p className="font-semibold text-base text-gray-800 mb-1">
            {stockShowValue}
          </p>
          <button
            onClick={() => handleShowStockModal(item)}
            className="px-3 py-1 text-xs rounded-lg cursor-pointer shadow-sm bg-green-500 text-white hover:bg-green-600 transition"
            title="ดูตำแหน่งจัดเก็บและรายละเอียด Stock (ตัวโชว์)"
          >
            Show Location Stock
          </button>
        </td>
      );
    }

    
    // 11. สถานะ Trade
    if (col.key === "TradeStatus") {
      return (
        <td className="p-3 border-r border-gray-200">
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
      );
    }
    
    // 12. Remark Trade / Action
    if (col.key === "TradeRemark") {
      return (
        <td className="p-3 text-sm max-w-xs whitespace-normal text-gray-600 border-r border-gray-200">
          <p className="text-xs mb-1 italic truncate">
            {item.RemarkTrade || "-"}
          </p>
          <button
            onClick={() => handleOpenModal(item)}
            className={`px-3 py-1 text-xs rounded-lg cursor-pointer shadow-md transition font-medium ${
              item.KeyRemarks && item.KeyRemarks.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            บันทึก/ดูการสื่อสาร ({item.KeyRemarks ? item.KeyRemarks.length : 0})
          </button>
        </td>
      );
    }
    return <td className="p-3">-</td>;
  };

  return (
    <div className="min-h-screen">
      {/* StockShowModal Component */}
      {isStockShow && (
        <StockShowModal
          setIsStockShow={setIsStockShow}
          selectedItem={selectedItem}
        />
      )}
      
      {/* Styles (ควรอยู่ในไฟล์ CSS หลัก) */}
      <style>
        {`
          /* Global styles to ensure compatibility */
          .bg-white input[type="number"], .bg-white input[type="text"] {
            background-color: transparent !important;
          }
        `}
      </style>

      <div className="p-8 bg-white shadow-2xl rounded-xl">
        {/* --- Header & Summary --- */}
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
            Inventory & Trade Monitor
          </h1>
          <p className="text-gray-500">
            ข้อมูลคงคลัง (Stock) และยอดขาย (Sale Out)
            พร้อมช่องทางการบันทึกและติดตาม **Action/Communication**
          </p>
        </header>

        {/* --- Key Metrics (Condensed Summary) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-pink-50 p-4 rounded-lg shadow-inner">
            <p className="text-sm text-pink-600 font-semibold">Total SKUs</p>
            <p className="text-2xl font-extrabold text-[#640037]">
              {formatNumber(filteredData.length)}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
            <p className="text-sm text-blue-600 font-semibold">Total Stock</p>
            <p className="text-2xl font-extrabold">
              {formatNumber(totalStock)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-inner">
            <p className="text-sm text-yellow-600 font-semibold">
              Avg. DOH (Weighted)
            </p>
            <p className="text-2xl font-extrabold">
              {formatNumber(avgDOH, 0)} วัน
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-inner">
            <p className="text-sm text-red-600 font-semibold">Abnormal Count</p>
            <p className="text-2xl font-extrabold">
              {formatNumber(abnormalCount)}
            </p>
          </div>
          {/* เพิ่มช่องที่ 5 (Total Data) */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner hidden lg:block">
            <p className="text-sm text-gray-600 font-semibold">Total Data</p>
            <p className="text-2xl font-extrabold text-gray-700">
              {formatNumber(data.length)}
            </p>
          </div>
           <div className="bg-green-50 p-4 rounded-lg shadow-inner hidden lg:block">
            <p className="text-sm text-green-600 font-semibold">ตัดจ่ายเฉลี่ยปัจจุบัน</p>
            <p className="text-2xl font-extrabold text-green-700">
              {formatNumber(data.length+50)}
            </p>
          </div>
            <div className="bg-orange-50 p-4 rounded-lg shadow-inner hidden lg:block">
            <p className="text-sm text-orange-600 font-semibold">ตัดจ่ายเฉลี่ย3เดือน</p>
            <p className="text-2xl font-extrabold text-orange-700">
              {formatNumber(data.length+100)}
            </p>
          </div>
            <div className="bg-sky-50 p-4 rounded-lg shadow-inner hidden lg:block">
            <p className="text-sm text-sky-600 font-semibold">ตัดจ่ายเฉลี่ย6เดือน</p>
            <p className="text-2xl font-extrabold text-gray-800">
              {formatNumber(data.length+150)}
            </p>
          </div>
           <div className="bg-purple-50 p-4 rounded-lg shadow-inner hidden lg:block">
            <p className="text-sm text-purple-600 font-semibold">ยอด PO ON HAND</p>
            <p className="text-2xl font-extrabold text-purple-700">
              {formatNumber(data.length+20)}
            </p>
          </div>
        </div>

        {/* --- Filter Bar --- */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-4 items-end p-4 bg-pink-50 rounded-lg border border-pink-200">
          {/* Search Bar */}
          <div className="col-span-2 md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              ค้นหาสินค้า (Code/Desc/Remark)
            </label>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ค้นหา..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full p-2 pl-9 pr-8 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              {filters.search && (
                <button
                  onClick={() => {
                    handleFilterChange("search", "");
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 hover:text-red-500 font-bold p-1 leading-none"
                  title="ล้างการค้นหา"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Filters Dropdowns (Brand, Class, Best 2025, Trade Status, Set/Type) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Brand
            </label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
            >
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Class
            </label>
            <select
              value={filters.class}
              onChange={(e) => handleFilterChange("class", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
            >
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              YN Best 2025
            </label>
            <select
              value={filters.best2025}
              onChange={(e) => handleFilterChange("best2025", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white focus:ring-pink-500 focus:border-pink-500"
            >
              {uniqueBest2025.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "" ? "(Blank)" : opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              สถานะ Trade
            </label>
            <select
              value={filters.tradeStatus}
              onChange={(e) => handleFilterChange("tradeStatus", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white focus:ring-pink-500 focus:border-pink-500"
            >
              {uniqueTradeStatus.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ชุด Set / แตก Set
            </label>
            <select
              value={filters.set}
              onChange={(e) => handleFilterChange("set", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white focus:ring-pink-500 focus:border-pink-500"
            >
              {uniqueSets.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600 font-medium">
            แสดงผล **{formatNumber(filteredData.length)}** รายการ จากทั้งหมด **
            {formatNumber(data.length)}** รายการ
          </p>
          <ColumnToggleDropdown
            hiddenColumns={hiddenColumns}
            toggleColumnVisibility={toggleColumnVisibility}
          />
        </div>

        {/* --- Data Table Container --- */}
        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
          <table className="min-w-full table-auto bg-white text-center">
            <thead className="bg-[#640037] text-white sticky top-0 text-sm">
              <tr>
                {ALL_COLUMNS.map(
                  (col) =>
                    !isColumnHidden(col.key) && (
                      <th
                        key={col.key}
                        className="p-3 border-l border-gray-500/30 first:border-l-0"
                      >
                        {col.name}
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={item.Code}
                    className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
                  >
                    {ALL_COLUMNS.map(
                      (col) =>
                        !isColumnHidden(col.key) && renderCell(item, col, index)
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={visibleColumnCount}
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
            </span>
            (Stock ล้นมาก) |
            <span className="text-orange-600 font-bold ml-2">
              180 &lt; DOH &lt; 365 วัน
            </span>
            (ควรระวัง) |
            <span className="text-green-600 font-bold ml-2">
              DOH &lt; 180 วัน
            </span>
            (ปกติ)
          </p>
        </div>

        {/* --- Trade Communication Modal --- */}
        {isModalOpen && selectedItem && (
          <TradeCommunicationModal
            item={selectedItem}
            onClose={handleCloseModal}
            onSubmit={handleSubmitAction}
            currentData={modalData}
            onDataChange={handleModalDataChange}
          />
        )}
      </div>
    </div>
  );
}