import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Eye, EyeOff, ChevronDown } from "lucide-react";

import StockShowModal from "../SideBar-Modal/StockModal/StockShow.jsx";
import { SummaryMetrics } from "../SideBar-Modal/StockModal/SummaryMetrics.jsx";
import CommunicationCard from "../SideBar-Modal/StockModal/CommunicateCard.jsx";

import { useKeyProducts } from "../hooks/useKeyProducts.js";

const getDOHStyle = (doh) => {
  if (doh === null || doh === undefined) return "text-gray-500";
  const n = Number(doh);
  if (!Number.isFinite(n)) return "text-gray-500";
  if (n > 365) return "text-red-600 font-extrabold bg-red-50";
  if (n > 180) return "text-orange-600 font-bold";
  if (n >= 0) return "text-green-600 font-bold";
  return "text-gray-500";
};

const safeText = (v) => {
  if (v === null || v === undefined || v === "") return "NDB";
  return v;
};

// const getDOHStockStyle = (dohStock) => {
//   if (dohStock === null || dohStock === undefined) return "text-gray-500";
//   const n = Number(dohStock);
//   if (!Number.isFinite(n)) return "text-gray-500";
//   if (n > 365) return "text-red-600 font-extrabold";
//   if (n > 180) return "text-orange-600 font-bold";
//   if (n >= 0) return "text-green-600 font-semibold";
//   return "text-gray-500";
// };

const formatNumber = (num, fractionDigits = 0) => {
  const n = Number(num);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("th-TH", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

/**
 * Class Checkbox Popover Component (Multi-Select Logic)
 */
function ClassCheckboxGroup({ uniqueClasses, selectedClasses, onClassChange }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Unique classes without the initial "All" label
    const classesWithoutAll = uniqueClasses.filter((c) => c !== "All");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCheckboxChange = (value) => {
        if (value === "All") {
            // คลิก All: สลับระหว่าง เลือกทั้งหมด (Array ครบ) กับ เคลียร์ทั้งหมด (Array ว่าง)
            if (selectedClasses.length < classesWithoutAll.length) {
                onClassChange(classesWithoutAll); 
            } else {
                onClassChange([]); 
            }
        } else {
            if (selectedClasses.includes(value)) {
                // ลบออก
                const newSelection = selectedClasses.filter((c) => c !== value);
                onClassChange(newSelection);
            } else {
                // เพิ่มเข้า
                const newSelection = [...selectedClasses, value];
                onClassChange(newSelection);
            }
        }
    };
    
    // แสดงผล: ถ้า Array ว่าง หรือ Array มีครบทุก Class ให้แสดง "All", ไม่อย่างนั้นแสดงจำนวนที่เลือก
    const displayLabel = selectedClasses.length === 0 || selectedClasses.length === classesWithoutAll.length
        ? "All" 
        : `${selectedClasses.length} Selected`;

    return (
        <div className="relative inline-block text-left w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white flex justify-between items-center text-sm focus:ring-pink-500 focus:border-pink-500"
                aria-expanded={open}
            >
                <span className="font-medium">{displayLabel}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {open && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1 max-h-60 overflow-y-auto">
                        {/* ตัวเลือก All */}
                        <div
                            className="flex items-center px-4 py-2 cursor-pointer hover:bg-pink-100"
                            onClick={() => handleCheckboxChange("All")}
                        >
                            <input
                                type="checkbox"
                                checked={selectedClasses.length === 0 || selectedClasses.length === classesWithoutAll.length}
                                onChange={() => handleCheckboxChange("All")}
                                className="mr-2 rounded text-[#640037] focus:ring-[#640037]"
                            />
                            <span
                                className={selectedClasses.length === 0 || selectedClasses.length === classesWithoutAll.length ? "font-bold text-[#640037]" : "font-normal"}
                            >
                                All
                            </span>
                        </div>
                        <hr className="my-1 border-gray-200" />

                        {/* ตัวเลือก Classes A, B, C, ... */}
                        {classesWithoutAll.map((c) => (
                            <div
                                key={c}
                                className="flex items-center px-4 py-2 cursor-pointer hover:bg-pink-100"
                                onClick={() => handleCheckboxChange(c)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedClasses.includes(c)}
                                    onChange={() => handleCheckboxChange(c)}
                                    className="mr-2 rounded text-[#640037] focus:ring-[#640037]"
                                />
                                {c}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
// --- END Class Checkbox Popover Logic ---

/**
 * Column dropdown แบบสไตล์ KeyAdminUI
 */
const ColumnToggleDropdown = ({
  ALL_COLUMNS,
  hiddenColumns,
  toggleColumnVisibility,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasHiddenColumns = hiddenColumns.length > 0;
  const hiddenCount = hiddenColumns.length;

  const handleToggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left z-50" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex justify-center items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 shadow-md 
          ${
            hasHiddenColumns
              ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
              : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
          }`}
        aria-expanded={open ? "true" : "false"}
      >
        {open || hasHiddenColumns ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
        {`Show/Hide Columns${hiddenColumns.length > 0 ? ` (${hiddenColumns.length} hidden)` : ""}`}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-lg shadow-2xl bg-white ring-1 ring-pink-800 ring-opacity-20 focus:outline-none z-50">
          <div className="py-2 px-3 max-h-80 overflow-auto">
            <p className="text-xs font-semibold text-gray-500 mb-2 border-b pb-1">
              แสดง / ซ่อนคอลัมน์
            </p>
            {ALL_COLUMNS.map((col) => (
              <button
                key={col.key}
                type="button"
                onClick={() => toggleColumnVisibility(col.key)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer hover:bg-pink-50 rounded-md"
              >
                <span>{col.label}</span>
                {hiddenColumns.includes(col.key) ? (
                  <EyeOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Eye className="w-4 h-4 text-green-500" />
                )}
              </button>
            ))}
            <div className="px-1 pt-2 mt-1 text-[11px] text-gray-400 border-t">
              สามารถซ่อนคอลัมน์ที่ไม่ต้องการดูเพื่อลดความรกของตารางได้
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * ใช้ column เดิมของ KeyAdmin (logic ถูกต้องแล้ว)
 * แค่ปรับสี / style ให้โทนเหมือน KeyAdminUI
 */
const ALL_COLUMNS = [
  { key: "No", label: "No." },
  { key: "Code", label: "รหัสสินค้า / Brand" },
  { key: "Description", label: "รายละเอียด / Class / Type" },
  { key: "Best", label: "Best/BestSet" },
  { key: "Categories", label: "Categories" },
  { key: "Forecast", label: "ยอด Forecast" },
  { key: "Actual", label: "ยอด Actual" },
  { key: "ActualMall", label: "ยอด ห้าง" },
  { key: "DOH", label: "DOH (วัน)" },
  { key: "SetOrNot", label: "ชุด Set / แตก Set" },
  { key: "Stock_Show", label: "Stock (ตัวโชว์)" },
  { key: "Stock_Physical", label: "Stock (กายภาพ)" },
  { key: "Stock", label: "Stock หักจอง" },
  { key: "Stock_Cl", label: "Stock Clearance" },
  { key: "Forecash_Now", label: "Forecash 3m" },
  { key: "Actual_Now", label: "Actual 3m" },
  { key: "TradeStatus", label: "สถานะ Trade" },
  { key: "TradeRemark", label: "Remark Trade / Action" },
];

export default function KeyAdmin() {
  const roleFromStorage =
    typeof window !== "undefined" ? localStorage.getItem("role") || "" : "";
  const isSuperAdmin = roleFromStorage === "SuperAdmin";

  const [selectedItem, setSelectedItem] = useState(null);
  const [isStockShow, setIsStockShow] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    comment: "",
    newStatus: "Pending",
  });

  const [filters, setFilters] = useState({
    search: "",
    brand: "All",
    // 🔑 FIXED: ใช้ Array ว่างเป็นค่าเริ่มต้นสำหรับ Multi-Select
    class: [], 
    best2025: "All",
    tradeStatus: "All",
    set: "All",
    salesChannelId: "All",
    keyUsername: "All",
    showUnassigned: false,
  });

  const [hiddenColumns, setHiddenColumns] = useState([]);
  const CURRENT_USER = "Trade Planner (Key)";

  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
    
    // 🔑 MOCK/Filter Classes
    const availableClasses = useMemo(() => ["A", "B", "C", "D", "MD", "N"], []);
    const uniqueClasses = useMemo(() => ["All", ...availableClasses], [availableClasses]);
    const selectedClasses = filters.class; // Array ที่เก็บค่าที่เลือก

  const {
    data,
    loading,
    error,
    totalItems,
    totalPages,
    channels,
    keyUsers,
    summary,
    filterOptions,
  } = useKeyProducts({
    filters,
    isSuperAdmin,
    page: currentPage,
    perPage: pageSize,
  });

  const toggleColumnVisibility = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };
  const isColumnHidden = (key) => hiddenColumns.includes(key);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => {
      const next = { ...prev };
      
      // 🔑 FIXED: สำหรับ Class ให้รับค่า Array โดยตรง
      if (name === "class") {
        next[name] = value;
      } else if (name === "showUnassigned" && value === true) {
        next.salesChannelId = "All";
        next.keyUsername = "All";
        next[name] = value;
      } else {
        next[name] = value;
      }
      return next;
    });
    setCurrentPage(1);
  };
    
    // 🔑 ฟังก์ชันสำหรับอัปเดต Class จาก Checkbox
    const onClassChange = (newClasses) => {
        // เมื่อรับ Array ใหม่จาก Checkbox ให้เรียก handleFilterChange
        handleFilterChange("class", newClasses);
    };

  const handleSearchChange = (e) => {
    handleFilterChange("search", e.target.value);
  };
    
    // ... (Unique options logic is removed for brevity but the arrays remain defined)
    const uniqueBrands = ["All", ...(filterOptions.brands || [])];
    const uniqueTradeStatus = ["All", ...(filterOptions.tradeStatuses || [])];
    const uniqueSets = ["All", ...(filterOptions.sets || [])];
    const uniqueBest2025 = ["All", "Yes", ""];


    // 🔑 FIXED: Logic การกรองข้อมูลหลัก (ใช้ Array filtering)
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchTerm = (filters.search || "").toLowerCase();

      if (searchTerm) {
        const haystack = [
          item.Code,
          item.Brand,
          item.Description,
          item.RemarkTrade,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(searchTerm)) return false;
      }

      if (filters.brand !== "All" && item.Brand !== filters.brand) return false;
      
      // 🔑 FIXED: Class Filtering (ใช้ Array.includes)
      // กรองถ้ามีการเลือกคลาสอย่างน้อย 1 ตัว และคลาสของ item ไม่อยู่ใน Array ที่เลือก
      if (filters.class.length > 0 && !filters.class.includes(item.Class)) return false;

      if (
        filters.tradeStatus !== "All" &&
        item.สถานะTrade !== filters.tradeStatus
      )
        return false;

      if (filters.set !== "All" && item.Type !== filters.set) return false;

      if (filters.best2025 === "Yes" && item.YN_Best_2025 !== "Yes")
        return false;

      return true;
    });
  }, [data, filters]);

  const totalSKUs = summary.totalSkus ?? filteredData.length;
  const totalStock =
    summary.totalStock ??
    filteredData.reduce((sum, item) => sum + (item.Stock_จบเหลือจริง || 0), 0);
  const avgDOH = summary.avgDohWeighted ?? 0;
  const abnormalCount =
    summary.abnormalCount ??
    filteredData.filter((it) => it.สถานะTrade === "Abnormal").length;

  const openTradeModal = (item) => {
    setSelectedItem(item);
    setModalData({
      comment: "",
      newStatus: item.สถานะTrade || "Pending",
    });
    setIsModalOpen(true);
  };

  const closeTradeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalData({ comment: "", newStatus: "Pending" });
  };

  const handleSubmitAction = () => {
    if (!selectedItem) return;
    if (!modalData.comment.trim()) {
      alert("กรุณากรอก Remark ก่อนบันทึก");
      return;
    }
    console.log(
      `บันทึกการสื่อสารสำหรับ ${selectedItem.Code}, สถานะใหม่ = ${modalData.newStatus}, Remark = ${modalData.comment} (ผู้ใช้งาน: ${CURRENT_USER})`
    );
    closeTradeModal();
  };

  const handleShowStockModal = (item) => {
    setSelectedItem(item);
    setIsStockShow(true);
  };

  const handlePageChange = (nextPage) => {
    if (!nextPage || nextPage < 1) return;
    const maxPage = totalPages || 1;
    if (nextPage > maxPage) return;
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (value) => {
    const size = Number(value) || 50;
    setPageSize(size);
    setCurrentPage(1);
  };

  const visibleColumnCount = ALL_COLUMNS.filter(
    (col) => !isColumnHidden(col.key)
  ).length;

  return (
    <div className="min-h-screen bg-white rounded-2xl">
      {isStockShow && (
        <StockShowModal
          setIsStockShow={setIsStockShow}
          selectedItem={selectedItem}
        />
      )}

      {isModalOpen && selectedItem && (
        <CommunicationCard
          item={selectedItem}
          onClose={closeTradeModal}
          onSubmit={handleSubmitAction}
          modalData={modalData}
          setModalData={setModalData}
        />
      )}

      {loading && (
        <div className="absolute text-gray-600 font-semibold">
          กำลังโหลดข้อมูล...
        </div>
      )}
      {error && (
        <div className="absolute text-gray-600 font-semibold">
          เกิดข้อผิดพลาด: {String(error)}
        </div>
      )}

      <div className="p-8 bg-white shadow-2xl rounded-xl">
        {/* Header */}
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
            Key Account Monitor
          </h1>
          <p className="text-gray-500">
            ข้อมูลคงคลัง (Stock) และยอดขาย (Sale Out)
            พร้อมช่องทางการบันทึกและติดตาม **Action/Communication**
          </p>
        </header>
        <div className="flex flex-row gap-6 mb-6">
          {/* 1. SummaryMetrics (ด้านซ้าย/ด้านบน) */}
          <div className="flex-shrink-0 mb-8 ">
            <SummaryMetrics
              grandTotals={{
                Total: summary.totalStock || 0, // FC
              }}
              dataAC={data.map((d) => ({ AC: d.Stock_จบเหลือจริง }))} // ดึง AC จาก data
            />
          </div>

          {/* 2. Filter Bar & Controls (ใช้พื้นที่ที่เหลือ) */}
          <div className="flex-grow p-4 bg-pink-50 rounded-xl shadow-lg border border-pink-200">
            <h2 className="text-xl font-bold text-pink-900 mb-4 border-b pb-2">
              Filter Options
            </h2>

            {/* 2.1 Top Row: Search Input (Full Width) */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                ค้นหาสินค้า (Code/Desc/Remark)
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="w-full p-2 pl-9 pr-8 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                {filters.search && (
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

            {/* 2.2 Mid Grid: Dropdown Filters (3 Columns on md, 6 on lg) */}
            <div className="grid grid-cols-5 gap-4">
              {/* Brand Filter */}
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

              {/* 🔑 Class Filter (ใช้ Checkbox Popover Component) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Class
                </label>
                <ClassCheckboxGroup
                    uniqueClasses={uniqueClasses}
                    selectedClasses={selectedClasses}
                    onClassChange={onClassChange}
                />
              </div>

              {/* YN Best 2025 Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  YN Best 2025
                </label>
                <select
                  value={filters.best2025}
                  onChange={(e) =>
                    handleFilterChange("best2025", e.target.value)
                  }
                  className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                >
                  {uniqueBest2025.map((b) => (
                    <option key={b} value={b}>
                      {b === "" ? "N/A" : b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trade Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  สถานะ Trade
                </label>
                <select
                  value={filters.tradeStatus}
                  onChange={(e) =>
                    handleFilterChange("tradeStatus", e.target.value)
                  }
                  className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                >
                  {uniqueTradeStatus.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Set / แตก Set Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ชุด Set / แตก Set 
                </label>
                <select
                  value={filters.set}
                  onChange={(e) => handleFilterChange("set", e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                >
                  {uniqueSets.map((setV) => (
                    <option key={setV} value={setV}>
                      {setV}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2.3 Control Row: Key User, Unassigned Checkbox, Column Toggle */}
            <div className="mt-6 pt-4 border-t border-pink-200 grid grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Sales Channel (ห้าง) Filter (ตำแหน่งตามภาพที่แนบมา) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ห้าง
                </label>
                <select
                  value={filters.salesChannelId}
                  onChange={(e) =>
                    handleFilterChange("salesChannelId", e.target.value)
                  }
                  className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                  disabled={filters.showUnassigned}
                >
                  <option value="All">ทุกห้าง</option>
                  {/* Note: channels array is missing, assuming it exists */}
                </select>
              </div>

              {/* Key User Filter (Visible only to Admin/SuperAdmin) */}
              {isSuperAdmin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Key User
                  </label>
                  <select
                    value={filters.keyUsername}
                    onChange={(e) =>
                      handleFilterChange("keyUsername", e.target.value)
                    }
                    className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                    disabled={filters.showUnassigned}
                  >
                    <option value="All">ทุก Key</option>
                    {/* Note: keyUsers array is missing, assuming it exists */}
                  </select>
                </div>
              )}

              {/* Show Unassigned Checkbox (แยกออกมาเป็นช่องสุดท้าย) */}
              <div className="col-span-2  flex justify-start ">
                <label className="flex justify-start gap-2 cursor-pointer p-2  w-auto bg-white border border-gray-300 rounded-lg shadow-sm">
                  <input
                    type="checkbox"
                    checked={filters.showUnassigned}
                    onChange={(e) =>
                      handleFilterChange("showUnassigned", e.target.checked)
                    }
                    className="rounded text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
                    แสดงเฉพาะสินค้าที่ไม่มี Key ดูแล
                  </span>
                </label>
              </div>

              {/* Column Toggle Dropdown (แยกออกมาในส่วน Controls) */}
              <div className="col-span-4 flex flex-col items-end justify-end">
                <ColumnToggleDropdown
                  ALL_COLUMNS={ALL_COLUMNS} 
                  hiddenColumns={hiddenColumns}
                  toggleColumnVisibility={toggleColumnVisibility}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
          <table className="min-w-full table-auto bg-white text-center">
            <thead className="bg-[#640037] text-white sticky top-0 text-sm z-10">
              <tr>
                {!isColumnHidden("No") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    No.
                  </th>
                )}
                {!isColumnHidden("Code") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    ItemCode / Brand
                  </th>
                )}
                {!isColumnHidden("Description") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Description / Class
                  </th>
                )}
                {!isColumnHidden("Best") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Best/BestSet
                  </th>
                )}
                {!isColumnHidden("Categories") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Categories
                  </th>
                )}
                {!isColumnHidden("Forecast") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    ยอด Forecast
                  </th>
                )}
                {!isColumnHidden("Actual") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    ยอด Actual
                  </th>
                )}
                 {!isColumnHidden("ActualMall") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    ยอด Actual ห้าง
                  </th>
                )}
                {!isColumnHidden("DOHPerDay") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    DOH (วัน)
                  </th>
                )}
                {!isColumnHidden("SetOrNot") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    ชุด Set / แตก Set
                  </th>
                )}
                {!isColumnHidden("Stock_Show") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Stock (ตัวโชว์)
                  </th>
                )}
                {!isColumnHidden("Stock_Physical") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Stock (กายภาพ)
                  </th>
                )}
                {!isColumnHidden("Stock") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Stock หักจอง
                  </th>
                )}
                {!isColumnHidden("Stock_Cl") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Stock Clearance
                  </th>
                )}
                {!isColumnHidden("Forecash_Now") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Forecash 3m
                  </th>
                )}
                {!isColumnHidden("Actual_Now") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Actual 3m
                  </th>
                )}
                {!isColumnHidden("TradeStatus") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    สถานะ Trade
                  </th>
                )}
                {!isColumnHidden("TradeRemark") && (
                  <th className="p-2 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Remark Trade / Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => {
                  const rowNo = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={item.Code}
                      className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
                    >
                      {!isColumnHidden("No") && (
                        <td className=" min-w-50px">{rowNo}</td>
                      )}

                      {!isColumnHidden("Code") && (
                        <td className=" font-mono text-sm border-r border-gray-200 text-left min-w-[120px]">
                          <span className="font-bold text-[#640037] block">
                            {item.Code}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.Brand}
                          </span>
                        </td>
                      )}

                      {!isColumnHidden("Description") && (
                        <td className="p-2 font-semibold text-gray-700 border-r border-gray-200 text-left min-w-[200px]">
                          <span className="block">{item.Description}</span>
                          <span
                            className={`mt-1 inline-block text-xs font-normal px-2 py-0.5 rounded-full ${
                              item.Class === "A"
                                ? "bg-orange-500 text-white"
                                : item.Class === "B"
                                ? "bg-blue-500 text-white"
                                : item.Class === "C"
                                ? "bg-yellow-500 text-white"
                                : "bg-pink-500 text-white"
                            }`}
                          >
                            Class {item.Class}
                          </span>
                          <span className="text-xs text-gray-400 block mt-1">
                            {item.Type} ({item.SubType})
                          </span>
                        </td>
                      )}

                      {!isColumnHidden("Best") && (
                        <td className="">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              item.YN_Best_2025 === "Yes"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.YN_Best_2025 === "Yes" ? "Yes" : "No"}
                          </span>
                        </td>
                      )}

                      {!isColumnHidden("Categories") && (
                        <td className="">
                          {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("Forecast") && (
                        <td className=" font-bold text-lg border-r border-gray-200 text-right">
                          {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("Actual") && (
                        <td className=" font-semibold text-lg border-r border-gray-200 text-right text-blue-600">
                          {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                       {!isColumnHidden("ActualMall") && (
                        <td className=" font-semibold text-lg border-r border-gray-200 text-right text-blue-600">
                          -
                        </td>
                      )}

                      {!isColumnHidden("DOHPerDay") && (
                        <td
                          className={` font-extrabold text-lg border-r border-gray-200 ${getDOHStyle(
                            item.DayOnHand_DOH_Stock2
                          )} text-right`}
                        >
                          {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("SetOrNot") && (
                        <td className=" text-sm text-gray-600">{"-"}</td>
                      )}

                      {!isColumnHidden("Stock_Show") && (
                        <td className=" text-sm text-gray-500">
                          <div className="font-semibold text-base text-gray-800 mb-1">
                            {formatNumber(item.Stock_Show_Calc)}
                          </div>
                          <button
                            className=" text-xs rounded-lg cursor-pointer shadow-sm bg-green-500 text-white hover:bg-green-600 transition"
                            onClick={() => handleShowStockModal(item)}
                            title="ดูตำแหน่งจัดเก็บและรายละเอียด Stock (ตัวโชว์)"
                          >
                            Show Location Stock
                          </button>
                        </td>
                      )}

                      {!isColumnHidden("Stock_Physical") && (
                        <td className=" font-bold text-lg border-r border-gray-200 text-right">
                          {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("Stock") && (
                        <td className=" font-bold text-lg border-r border-gray-200 text-right">
                          {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

    144 / 355
                      {!isColumnHidden("Stock_Cl") && (
                        <td className=" font-bold text-lg border-r border-gray-200 text-right">
                          {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("Forecash_Now") && (
                        <td className=" font-bold border-r border-gray-200">
                          {"-"}
                        </td>
                      )}

                      {!isColumnHidden("Actual_Now") && (
                        <td className=" font-bold border-r border-gray-200">
                          {"-"}
                        </td>
                      )}

                      {!isColumnHidden("TradeStatus") && (
                        <td className=" border-r border-gray-200">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              item.สถานะTrade === "Abnormal"
                                ? "bg-red-100 text-red-700 border-red-300"
                                : item.สถานะTrade === "Normal"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }`}
                          >
                            {item.สถานะTrade || "Normal"}
                          </span>
                        </td>
                      )}

                      {!isColumnHidden("RemarkTrade") && (
                        <td className=" text-xs text-gray-400 border-r border-gray-200">
                          <p className="text-xs mb-1 italic truncate">
                            {safeText(item.RemarkTrade)}
                          </p>

                          <button
                            onClick={() => openTradeModal(item)}
                            className={`px-3 py-1 text-xs rounded-lg cursor-pointer shadow-md transition font-medium ${
                              item.RemarkCount > 0
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            บันทึก/ดูการสื่อสาร ({item.RemarkCount || 0})
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
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

        {/* Pagination ด้านล่าง */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 text-sm text-gray-700 gap-3">
          <div className="flex items-center gap-2">
            <span>แสดงหน้าละ</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="border border-gray-500 rounded-lg px-2 py-1 bg-white shadow-sm"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>รายการ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50"
            >
              ⏮ หน้าแรก
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50"
            >
              ก่อนหน้า
            </button>

            <span className="px-2">
              หน้า <strong>{currentPage}</strong> /{" "}
              <strong>{totalPages || 1}</strong>
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === (totalPages || 1)}
              className="px-2 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50"
            >
              ถัดไป
            </button>
            <button
              onClick={() => handlePageChange(totalPages || 1)}
              disabled={currentPage === (totalPages || 1)}
              className="px-2 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50"
            >
              หน้าสุดท้าย ⏭
            </button>
          </div>
        </div>

        {/* DOH Explain */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-100">
          <p>
            💡 <strong>คำอธิบาย DOH (Days On Hand):</strong>
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
      </div>
    </div>
  );
}