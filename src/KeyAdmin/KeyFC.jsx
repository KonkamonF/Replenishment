import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Eye, EyeOff, ChevronDown, Plus } from "lucide-react";
import { SummaryMetrics } from "../SideBar-Modal/StockModal/SummaryMetrics.jsx";
import KeyFCMultiEntryModal from "../SideBar-Modal/StockModal/KeyFCMultiEntryModal.jsx";

// Mock AC data for completeness
const initialKeyFCData = Array.from({ length: 200 }, (_, i) => ({
  Code: `09-55555-${(i + 1).toString().padStart(3, "0")}`, // 001–200
  Description: `KITCHEN HOOD TNP 70 - ${i + 1}`,
  Type: i % 3 === 0 ? "ACC" : i % 3 === 1 ? "Sink" : "Hood", // Mock Type data
  Class: ["A", "B", "C", "MD", "N"][i % 5], // Mock Class data
  Total: 5000 + Math.floor(Math.random() * 1500),
  AC: 5500 + Math.floor(Math.random() * 1000), // Mock AC (Actual) data

  "New Code Item": 10 + Math.floor(Math.random() * 10), // Mock numerical value
  ราคากลางต่อหน่วย: 5000 + Math.floor(Math.random() * 300),
  ราคาต่ำสุดต่อหน่วย: 4800 + Math.floor(Math.random() * 200),
  ราคาโปรโมชั่นต่ำสุด: 4500 + Math.floor(Math.random() * 300),
  "Traget Sale Unit": 100 + Math.floor(Math.random() * 200),
  รายตัวต่อหน่วย: 4800 + Math.floor(Math.random() * 500),
  "Other(K Beer)": 300 + Math.floor(Math.random() * 300),
  "GBH Beer": 300 + Math.floor(Math.random() * 300),
  "GBH P Ann": 50 + Math.floor(Math.random() * 100),
  "HP Beer": 800 + Math.floor(Math.random() * 400),
  "HP Online P Ann": 300 + Math.floor(Math.random() * 300),
  "HP P Ann": 300 + Math.floor(Math.random() * 300),
  BTV: 50 + Math.floor(Math.random() * 100),
  Dealer: 300 + Math.floor(Math.random() * 300),
  Dohome: 300 + Math.floor(Math.random() * 300),
  "The Mall": 50 + Math.floor(Math.random() * 100),
  TWD: 300 + Math.floor(Math.random() * 300),
  "Online All": 300 + Math.floor(Math.random() * 300),
}));

// ชื่อคอลัมน์ช่องทางจำหน่ายที่ต้องการแก้ไขได้
const editableChannels = [
  "New Code Item",
  "ราคากลางต่อหน่วย",
  "ราคาต่ำสุดต่อหน่วย",
  "ราคาโปรโมชั่นต่ำสุด",
  "Traget Sale Unit",
  "รายตัวต่อหน่วย",
  "Other(K Beer)",
  "GBH Beer",
  "GBH P Ann",
  "HP Beer",
  "HP Online P Ann",
  "HP P Ann",
  "BTV",
  "Dealer",
  "Dohome",
  "The Mall",
  "TWD",
  "Online All",
];

// ชื่อคอลัมน์ทั้งหมดที่สามารถซ่อน/แสดงได้ (รวม Channels)
const hideableColumns = ["Description", "Type", "Class", ...editableChannels];

const availableClasses = ["A", "B", "C", "MD", "N"];

// Helper function คำนวณยอดรวมใหม่
const calculateTotal = (item) => {
  return editableChannels.reduce(
    (sum, channel) => sum + (parseInt(item[channel]) || 0),
    0
  );
};

// --- Helpers (ย้ายมาด้านบน) ---
const safeNum = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const isColumnHidden = (hiddenColumns, columnKey) => !!hiddenColumns[columnKey];

// --- Column Toggle Dropdown (แก้ไขให้ใช้ Props ถูกต้อง) ---
const ColumnToggleDropdown = ({
  hiddenColumns,
  isColumnHidden,
  toggleColumnVisibility,
  editableChannels,
  hideableColumns,
}) => {
  const allColumns = [
    { key: "Description", name: "Description" },
    { key: "Type", name: "Type" },
    { key: "Class", name: "Class" },
    ...editableChannels.map((c) => ({ key: c, name: c })),
  ];

  const hasHiddenColumns = allColumns.some((col) => isColumnHidden(col.key));

  const hiddenCount = useMemo(() => {
    return hideableColumns.filter((c) => isColumnHidden(hiddenColumns, c))
      .length;
  }, [hiddenColumns, hideableColumns]);

  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div className="relative inline-block text-left z-50" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`inline-flex justify-center items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 shadow-md 
          ${
            hasHiddenColumns
              ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
              : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
          }`}
        aria-expanded={open}
      >
        {hasHiddenColumns ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
        {`Show/Hide Columns ${hiddenCount > 0 ? `(${hiddenCount})` : ""}`}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {open && (
        <div
          id="column-menu"
          className="origin-top-right absolute right-0 mt-2 w-72 rounded-lg shadow-2xl bg-white ring-1 ring-pink-800 ring-opacity-20 focus:outline-none z-50"
        >
          <div className="p-2 max-h-60 overflow-y-auto">
            {allColumns.map((col) => (
              <div
                key={col.key}
                onClick={() => toggleColumnVisibility(col.key)}
                className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:bg-pink-100 cursor-pointer transition duration-100"
              >
                <span className="font-medium">{col.name}</span>
                {isColumnHidden(col.key) ? (
                  <EyeOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Eye className="w-4 h-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Class Checkbox Popover Logic ---

function ClassCheckboxGroup({ uniqueClasses, selectedClasses, onClassChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
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
      if (selectedClasses.length < classesWithoutAll.length) {
        onClassChange(classesWithoutAll);
      } else {
        onClassChange([]);
      }
    } else {
      if (selectedClasses.includes(value)) {
        const newSelection = selectedClasses.filter((c) => c !== value);
        onClassChange(newSelection);
      } else {
        let newSelection = [...selectedClasses, value];
        onClassChange(newSelection);
      }
    }
  };

  const displayLabel =
    selectedClasses.length === 0 ||
    selectedClasses.length === classesWithoutAll.length
      ? "All"
      : `${selectedClasses.length} Selected`;

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full p-2.5 pr-10 border border-gray-300 text-gray-700 rounded-xl shadow-sm bg-white flex justify-between items-center text-sm"
        aria-expanded={open}
      >
        <span className="font-medium">{displayLabel}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
          <div className="py-1 max-h-60 overflow-y-auto">
            {/* ตัวเลือก All */}
            <div
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-pink-100"
              onClick={() => handleCheckboxChange("All")}
            >
              <input
                type="checkbox"
                checked={
                  selectedClasses.length === 0 ||
                  selectedClasses.length === classesWithoutAll.length
                }
                onChange={() => handleCheckboxChange("All")}
                className="mr-2 rounded text-[#640037] focus:ring-[#640037]"
              />
              <span
                className={
                  selectedClasses.length === 0
                    ? "font-bold text-[#640037]"
                    : "font-normal"
                }
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

// --- Main Component ---
export default function KeyFC() {
  const [data, setData] = useState(initialKeyFCData);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    // 🔑 FIXED: Class ใช้ Array ว่างเป็นค่าเริ่มต้นสำหรับ Multi-Select
    class: [],
    brand: "All",
    ynBest: "All",
    type: "All",
  });
  const [hiddenColumns, setHiddenColumns] = useState({});

  // --- Pagination States ---
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Class Checkbox Props ---
  const uniqueClasses = useMemo(() => ["All", ...availableClasses], []);
  const selectedClasses = filters.class; // Array ที่เก็บค่าที่เลือก

  // 🔑 ฟังก์ชันสำหรับอัปเดต Class จาก Checkbox
  const onClassChange = (newClasses) => {
    // 🔑 เมื่อรับ Array ใหม่จาก Checkbox ให้เรียก handleFilterChange
    handleFilterChange("class", newClasses);
  };
  // --- END Class Checkbox Props ---

  const handleMultiEntrySubmit = (newEntries, mainComment) => {
    setIsDataChanged(true);

    const newData = [...data];

    newEntries.forEach((entry) => {
      const existingIndex = newData.findIndex(
        (item) => item.Code === entry.sku
      );

      if (existingIndex !== -1) {
        newData[existingIndex] = {
          ...newData[existingIndex],
          // อัปเดตยอด FC
          "New Code Item": entry.quantity,
          // อัปเดตยอดสั่งซื้อ
          "Traget Sale Unit": entry.requiredQuantity,
          Description: entry.description,
          Class: entry.class,
          Total: calculateTotal({
            ...newData[existingIndex],
            "New Code Item": entry.quantity,
          }),
        };
      } else {
        console.warn(
          `SKU ${entry.sku} not found in current data. Skipping entry.`
        );
      }
    });

    setData(newData);
    setIsModalOpen(false);
  };

  const contributingChannels = [
    "Other(K Beer)",
    "GBH Beer",
    "GBH P Ann",
    "HP Beer",
    "HP Online P Ann",
    "HP P Ann",
    "BTV",
    "Dealer",
    "Dohome",
    "The Mall",
    "TWD",
    "Online All",
  ];

  // --- Logic การกรองข้อมูลหลัก ---

  const filteredData = useMemo(() => {
    let currentData = [...data];

    const lowerCaseSearch = filters.search.toLowerCase();

    // 1. กรองด้วย Item Search (Code หรือ Description)
    if (lowerCaseSearch) {
      currentData = currentData.filter(
        (item) =>
          item.Code.toLowerCase().includes(lowerCaseSearch) ||
          item.Description.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // 2. 🔑 FIXED: กรองด้วย Class Filter (รองรับ Array Multi-Select)
    // ถ้า Array ไม่ว่าง (filters.class.length > 0) ให้กรอง
    if (filters.class.length > 0) {
      currentData = currentData.filter((item) =>
        filters.class.includes(item.Class)
      );
    }

    // 3. กรองด้วย Type Filter
    if (filters.type !== "All") {
      currentData = currentData.filter((item) => item.Type === filters.type);
    }

    // 4. กรอง YN Best
    if (filters.ynBest !== "All") {
      const checkValue =
        filters.ynBest === "Y"
          ? "Yes"
          : filters.ynBest === "N"
          ? ""
          : filters.ynBest;
      currentData = currentData.filter(
        (item) => (item.YN_Best_2025 || "") === checkValue
      );
    }

    return currentData;
  }, [data, filters]);

  const grandTotals = useMemo(() => {
    const totals = { Total: 0, AC: 0 };
    contributingChannels.forEach((channel) => (totals[channel] = 0));

    filteredData.forEach((item) => {
      totals.Total += item.Total;
      totals.AC += item.AC || 0;

      contributingChannels.forEach((channel) => {
        totals[channel] += parseInt(item[channel]) || 0;
      });
    });

    return totals;
  }, [filteredData]);

  // --- Logic สำหรับการแบ่งหน้าและแสดงผล ---

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredData.length / pageSize);
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0 && filteredData.length > 0) {
      setCurrentPage(1);
    } else if (currentPage === 0 && filteredData.length > 0) {
      setCurrentPage(1);
    }
  }, [filteredData.length, pageSize]);

  // 2. ข้อมูลที่แสดงในหน้าปัจจุบัน (PAGINATED DATA)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // 3. Function จัดการการเปลี่ยนหน้า
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 4. Function จัดการการเปลี่ยนจำนวนรายการต่อหน้า
  const handlePageSizeChange = (value) => {
    const size = Number(value) || 20;
    setPageSize(size);
    setCurrentPage(1);
  };

  // Function จัดการการเปลี่ยนแปลงค่าในช่อง Input (คงเดิม)
  const handleValueChange = (code, channel, value) => {
    setIsDataChanged(true);

    const newData = data.map((item) => {
      if (item.Code === code) {
        const numericValue = Math.max(0, parseInt(value) || 0);
        const updatedItem = { ...item, [channel]: numericValue };

        updatedItem.Total = calculateTotal(updatedItem);
        return updatedItem;
      }
      return item;
    });
    setData(newData);
  };

  // Function จัดการการเปลี่ยนแปลง Class (Dropdown Selector)
  const handleClassChange = (code, newClass) => {
    setIsDataChanged(true);

    const newData = data.map((item) => {
      if (item.Code === code) {
        return { ...item, Class: newClass };
      }
      return item;
    });
    setData(newData);
  };

  // Function สำหรับการยืนยันการเปลี่ยนแปลง (Submit) (พร้อม Mock Logic)
  const handleSubmit = () => {
    if (!isDataChanged) {
      console.log("ไม่พบการเปลี่ยนแปลงข้อมูล กรุณาแก้ไขข้อมูลก่อนบันทึก.");
      return;
    }

    console.log("Saving data:", data);
    setIsDataChanged(false);
  };

  // สลับการซ่อน/แสดงคอลัมน์ (คงเดิม)
  const toggleColumnVisibility = (column) => {
    setHiddenColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Function ตรวจสอบว่าคอลัมน์ถูกซ่อนหรือไม่
  const isColumnHidden = (columnKey) => !!hiddenColumns[columnKey];

  // คอลัมน์ที่ถูกซ่อนอยู่
  const hiddenColumnsList = hideableColumns
    .filter((c) => isColumnHidden(c))
    .map((c) => c.split("(")[0].trim())
    .join(", ");

  // --- UPDATED: Unified Filter Handler ---
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  return (
    <>
      {/* 🔑 Modal Component (แสดงผลเป็น Overlay) */}
      <KeyFCMultiEntryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSubmitProducts={handleMultiEntrySubmit}
      />

      <div className="p-8 bg-white shadow-2xl rounded-xl">
        {/* --- Header with Title and Info --- */}
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
            Key Product Forecast (FC)
          </h1>
          <p className="text-gray-500 ">
            ปรับปรุงยอดพยากรณ์การขายแยกตามช่องทางจำหน่าย (Channels) และแก้ไข
            Class สินค้า
          </p>
        </header>

        {/* --- 1. GRAND TOTAL SUMMARY --- */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* 1.1 Summary Chart (Fixed Width) */}
          <div className="lg:w-96 flex-shrink-0">
            <SummaryMetrics grandTotals={grandTotals} dataAC={filteredData} />
          </div>

          {/* 1.2 Filter Bar */}
          <div className="flex-grow p-4 bg-pink-50 rounded-xl shadow-lg border border-pink-200">
            <h2 className="text-xl font-bold text-pink-900 mb-4 border-b pb-2">
              Filter Options
            </h2>

            {/* Search Input */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                ค้นหาสินค้า (Code/Desc)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหารหัสสินค้า หรือคำอธิบายสินค้า..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="p-2.5 pl-10 pr-8 border border-gray-300 rounded-xl shadow-sm focus:ring-pink-500 focus:border-pink-500 bg-white w-full transition"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange("search", "")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 hover:text-red-500 font-bold p-1 leading-none"
                    title="ล้างการค้นหา"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="p-2.5 pr-10 text-gray-700 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm w-full"
                >
                  <option value="All">All Brands</option>
                  <option value="TNP">TNP</option>
                  <option value="TNS">TNS</option>
                </select>
              </div>
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="p-2.5 pr-10 text-gray-700 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm w-full"
                >
                  <option value="All">All Types</option>
                  <option value="ACC">ACC</option>
                  <option value="Sink">Sink</option>
                  <option value="Hood">Hood</option>
                </select>
              </div>
              {/* 🔑 Class Filter (Multi-Select Popover) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Class
                </label>
                <ClassCheckboxGroup
                  uniqueClasses={uniqueClasses}
                  selectedClasses={selectedClasses}
                  onClassChange={onClassChange}
                />
              </div>
              {/* YN Best 2025 (Mock Filter) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  YN Best 2025
                </label>
                <select
                  value={filters.ynBest}
                  onChange={(e) => handleFilterChange("ynBest", e.target.value)}
                  className="p-2.5 pr-10 text-gray-700 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm w-full"
                >
                  <option value="All">All</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
            </div>

            {/* --- Column Toggle Bar & Save Button --- */}
            <div className="flex justify-end items-end mt-12 gap-4">
              {/* ปุ่มสำหรับเปิด Modal */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-lg transition duration-200"
              >
                <Plus size={18} className="mr-1" /> ป้อน FC หลายรายการ
              </button>

              <div className="flex gap-4">
                <ColumnToggleDropdown
                  hiddenColumns={hiddenColumns}
                  isColumnHidden={isColumnHidden}
                  toggleColumnVisibility={toggleColumnVisibility}
                  editableChannels={editableChannels}
                  hideableColumns={hideableColumns}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!isDataChanged}
                  className={`px-4 py-2 rounded-lg font-semibold shadow-lg text-sm transition duration-200
                  ${
                    isDataChanged
                      ? "bg-green-600 text-white hover:bg-green-700 transform hover:scale-105"
                      : "bg-gray-200 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isDataChanged ? "🔒 Save Forecast" : "No Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Data Table --- */}
        <div className="relative overflow-x-scroll border border-gray-300 rounded-2xl shadow-xl ">
          <table className="table-auto text-sm w-full">
            {/* 🔑 แก้ไข: เพิ่ม sticky top-0 และ z-10 ให้ Header ตรึงอยู่กับที่ */}
            <thead className="bg-[#640037] text-nowrap text-white sticky top-0 z-10">
              <tr className="bg-[#640037]">
                {/* Fixed Columns */}
                <th className="p-3 bg-[#640037] shadow-md">No.</th>
                <th className="p-3 bg-[#640037] shadow-md">Code</th>
                {/* Visible/Hideable Columns */}
                {!isColumnHidden("Description") && (
                  <th className="p-3 bg-[#640037]">Description</th>
                )}
                {!isColumnHidden("Type") && (
                  <th className="p-3 bg-[#640037]">Type</th>
                )}
                {!isColumnHidden("Class") && (
                  <th className="p-3 bg-[#640037]">Class</th>
                )}
                {/* Total Columns */}
                <th className="p-3 bg-[#640037]">Total FC</th>
                <th className="p-3 bg-[#640037]">Total AC</th>
                {/* Editable Channel Headers */}
                {editableChannels.map((channel) =>
                  !isColumnHidden(channel) ? (
                    <th
                      key={channel}
                      className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap min-w-[120px] bg-[#640037]"
                    >
                      {channel}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>

            <tbody>
              {/* Table Body (ใช้ paginatedData) */}
              {paginatedData.map((item, index) => (
                <tr
                  key={item.Code + index}
                  className="border-b text-center border-gray-200 hover:bg-pink-50 p-3"
                >
                  {/* No. */}
                  <td className="font-bold text-[#640037] p-3 w-36 font-mono text-sm border-r border-gray-200">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  {/* Code */}
                  <td className="p-2 text-nowrap border-r border-gray-200">
                    <span className="font-bold text-[#640037]">
                      {item.Code}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">{item.Type}</span>
                  </td>

                  {/* Description */}
                  {!isColumnHidden("Description") && (
                    <td className="p-3 font-medium text-gray-700 border-r border-gray-200 min-w-[250px]">
                      {item.Description}
                    </td>
                  )}
                  {/* Type */}
                  {!isColumnHidden("Type") && (
                    <td className="p-3 text-xs text-gray-700">{item.Type}</td>
                  )}
                  {/* Class Selector */}
                  {!isColumnHidden("Class") && (
                    <td className="p-1 border-l border-gray-200">
                      <select
                        value={item.Class}
                        onChange={(e) =>
                          handleClassChange(item.Code, e.target.value)
                        }
                        className="p-1 border border-gray-300 rounded focus:ring-pink-800 focus:border-pink-800 text-sm font-bold"
                      >
                        {availableClasses.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                  {/* Total FC */}
                  <td className="p-3 font-extrabold text-lg text-red-600 border-l border-gray-200">
                    {item.Total.toLocaleString()}
                  </td>
                  {/* Total AC (Mock) */}
                  <td className="p-3 font-normal text-gray-600 border-l border-gray-200">
                    {item.AC.toLocaleString()}
                  </td>
                  {/* Editable Channel Inputs */}
                  {editableChannels.map((channel) =>
                    !isColumnHidden(channel) ? (
                      <td
                        key={channel}
                        className="p-1 border-l border-gray-200"
                      >
                        <input
                          type="text"
                          min="0"
                          value={item[channel]}
                          onChange={(e) =>
                            handleValueChange(
                              item.Code,
                              channel,
                              e.target.value
                            )
                          }
                          className="w-full p-1 text-center border-b-2 border-pink-300 text-sm font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-900 focus:border-pink-800 focus:rounded-lg"
                          style={{ backgroundColor: "transparent" }}
                        />
                      </td>
                    ) : null
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* แสดงเมื่อไม่มีข้อมูล */}
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-white text-lg">
              ไม่พบข้อมูลตามเงื่อนไขการค้นหา
            </div>
          )}
        </div>

        {/* --- Pagination Controls --- */}
        {filteredData.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 p-4 border-t border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-700 gap-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                จำนวนรายการที่พบ: {filteredData.length.toLocaleString()}
              </span>
              <span className="mx-2">|</span>
              <span>แสดงหน้าละ</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="border border-gray-500 rounded-lg px-2 py-1 bg-white shadow-sm"
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={filteredData.length}>ทั้งหมด</option>
              </select>
              <span>รายการ</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50 transition"
                aria-label="หน้าแรก"
              >
                ⏮ หน้าแรก
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50 transition"
                aria-label="ก่อนหน้า"
              >
                ก่อนหน้า
              </button>

              <span className="px-2 font-medium">
                หน้า <strong>{currentPage.toLocaleString()}</strong> /{" "}
                <strong>{totalPages.toLocaleString() || 1}</strong>
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === (totalPages || 1)}
                className="px-2 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50 transition"
                aria-label="ถัดไป"
              >
                ถัดไป
              </button>
              <button
                onClick={() => handlePageChange(totalPages || 1)}
                disabled={currentPage === (totalPages || 1)}
                className="px-2 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50 transition"
                aria-label="หน้าสุดท้าย"
              >
                หน้าสุดท้าย ⏭
              </button>
            </div>
          </div>
        )}

        {/* --- Information Box (คงเดิม) --- */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 shadow-inner">
          <p className="mb-2">
            ⚠️ **หมายเหตุ:** ข้อมูล **Total FC**
            จะถูกคำนวณอัตโนมัติจากผลรวมของยอดขายตามช่องทางจำหน่ายที่ท่านกรอก
          </p>
          <p>
            💡 **เคล็ดลับ:** ใช้ช่อง **ค้นหาสินค้า**
            เพื่อกรองข้อมูลทันทีที่พิมพ์ และใช้ปุ่ม **Show/Hide Columns**
            เพื่อจัดการการแสดงคอลัมน์ในตารางสำหรับการแก้ไขเฉพาะช่องทางที่ต้องการ
          </p>
        </div>
      </div>
    </>
  );
}
