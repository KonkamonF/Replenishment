import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Eye, EyeOff, ChevronDown } from "lucide-react";

// Mock AC data for completeness
const initialKeyFCData = Array.from({ length: 200 }, (_, i) => ({
  Code: `09-55555-${(i + 1).toString().padStart(3, "0")}`, // 001–200
  Description: `KITCHEN HOOD TNP 70 - ${i + 1}`,
  Type: i % 3 === 0 ? "ACC" : i % 3 === 1 ? "Sink" : "Hood", // Mock Type data
  Class: ["A", "B", "C", "MD", "N"][i % 5], // Mock Class data
  Total: 5000 + Math.floor(Math.random() * 1500),
  AC: 5500 + Math.floor(Math.random() * 1000), // Mock AC (Actual) data

  "New Code Item": (10 + Math.floor(Math.random() * 5)).toString(),
  ราคากลางต่อหน่วย: (5000 + Math.floor(Math.random() * 300)).toString(),
  ราคาต่ำสุดต่อหน่วย: (4800 + Math.floor(Math.random() * 200)).toString(),
  ราคาโปรโมชั่นต่ำสุด: (4500 + Math.floor(Math.random() * 300)).toString(),
  "Traget Sale Unit": (100 + Math.floor(Math.random() * 200)).toString(),
  รายตัวต่อหน่วย: (4800 + Math.floor(Math.random() * 500)).toString(),
  "Other(K Beer)": (300 + Math.floor(Math.random() * 300)).toString(),
  "GBH Beer": (300 + Math.floor(Math.random() * 300)).toString(),
  "GBH P Ann": (50 + Math.floor(Math.random() * 100)).toString(),
  "HP Beer": (800 + Math.floor(Math.random() * 400)).toString(),
  "HP Online P Ann": (300 + Math.floor(Math.random() * 300)).toString(),
  "HP P Ann": (300 + Math.floor(Math.random() * 300)).toString(),
  BTV: (50 + Math.floor(Math.random() * 100)).toString(),
  Dealer: (300 + Math.floor(Math.random() * 300)).toString(),
  Dohome: (300 + Math.floor(Math.random() * 300)).toString(),
  "The Mall": (50 + Math.floor(Math.random() * 100)).toString(),
  TWD: (300 + Math.floor(Math.random() * 300)).toString(),
  "Online All": (300 + Math.floor(Math.random() * 300)).toString(),
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

// ช่องที่ต้องนับรวมจริง ๆ สำหรับ Total FC
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

// ชื่อคอลัมน์ทั้งหมดที่สามารถซ่อน/แสดงได้ (รวม Channels)
const hideableColumns = ["Description", "Type", "Class", ...editableChannels];

const availableClasses = ["A", "B", "C", "D", "MD", "N"];

// Helper function คำนวณยอดรวมใหม่
const calculateTotal = (item) => {
  return contributingChannels.reduce(
    (sum, channel) => sum + (parseInt(item[channel]) || 0),
    0
  );
};

// Helper function สำหรับจัดรูปแบบตัวเลข
const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || num === "") return "-";
  const n = Number(num);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
};

// --- Component สำหรับ Dropdown Toggle Column ---
const ColumnToggleDropdown = ({
  hiddenColumnsList,
  isColumnHidden,
  toggleColumnVisibility,
  editableChannels,
}) => {
  const allColumns = [
    { key: "Description", name: "Description" },
    { key: "Type", name: "Type" },
    { key: "Class", name: "Class" },
    ...editableChannels.map((c) => ({ key: c, name: c })),
  ];

  const hasHiddenColumns = allColumns.some((col) => isColumnHidden(col.key));
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div className="relative inline-block text-left z-10" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`inline-flex justify-center items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 shadow-md ${
          hasHiddenColumns
            ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
            : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
        }`}
      >
        {open || hasHiddenColumns ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
        {`Show/Hide Columns ${
          hasHiddenColumns
            ? `(${hiddenColumnsList.split(", ").filter((n) => n).length})`
            : ""
        }`}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {open && (
        <div
          id="column-menu"
          className="origin-top-right absolute right-0 mt-2 w-72 rounded-lg shadow-2xl bg-white ring-1 ring-pink-800 ring-opacity-20 focus:outline-none z-50"
          role="menu"
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {allColumns.map((col) => (
              <div
                key={col.key}
                onClick={() => toggleColumnVisibility(col.key)}
                className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:bg-pink-100 cursor-pointer transition duration-100"
                role="menuitem"
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

// --- Component สำหรับ Class Filter Checkbox Popover ---
const ClassFilterDropdown = ({
  selectedClasses,
  onClassChange,
  uniqueClasses,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLabel = useMemo(() => {
    if (selectedClasses.length === 0) {
      return "All";
    }
    return `${selectedClasses.length} Selected`;
  }, [selectedClasses]);

  const handleCheckboxChange = (value) => {
    const classesWithoutAll = uniqueClasses.filter((c) => c !== "All");

    if (value === "All") {
      // ถ้าเลือก All: สลับระหว่างเลือกทั้งหมด กับไม่มีเลย
      if (
        selectedClasses.length === classesWithoutAll.length ||
        selectedClasses.length === 0
      ) {
        // เคลียร์ทั้งหมด
        onClassChange([]);
      } else {
        // เลือกทั้งหมด
        onClassChange(classesWithoutAll);
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

  const isAllChecked =
    selectedClasses.length === 0 ||
    selectedClasses.length === uniqueClasses.filter((c) => c !== "All").length;

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full p-2.5 pr-10 border border-gray-300 text-gray-700 rounded-xl shadow-sm bg-white flex justify-between items-center"
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
                checked={isAllChecked}
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
            {uniqueClasses
              .filter((c) => c !== "All")
              .map((c) => (
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
};

// --- Main Component ---
export default function Tradeshipping() {
  const [data, setData] = useState(initialKeyFCData);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    // 🚨 แก้ไข: เปลี่ยนค่าเริ่มต้นของ class เป็น Array ว่าง
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

  // Unique Types สำหรับ Filter Dropdown
  const uniqueTypes = useMemo(
    () => ["All", ...new Set(initialKeyFCData.map((d) => d.Type))],
    []
  );

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

    // 2. กรองด้วย Class Filter (รองรับ Array)
    if (filters.class.length > 0) {
      currentData = currentData.filter((item) =>
        filters.class.includes(item.Class)
      );
    }

    // 3. กรองด้วย Type Filter
    if (filters.type !== "All") {
      currentData = currentData.filter((item) => item.Type === filters.type);
    }

    // 4. กรองด้วย Brand (Mock)
    if (filters.brand !== "All") {
      // Mock Brand: Assume Brand is determined by Code prefix or Description content
      const searchBrand = filters.brand.toLowerCase();
      currentData = currentData.filter(
        (item) =>
          item.Code.toLowerCase().startsWith(searchBrand) ||
          item.Description.toLowerCase().includes(searchBrand)
      );
    }

    return currentData;
  }, [data, filters]);

  const grandTotals = useMemo(() => {
    const totals = { Total: 0, AC: 0 };
    editableChannels.forEach((channel) => (totals[channel] = 0));

    filteredData.forEach((item) => {
      totals.Total += calculateTotal(item); // 🚨 คำนวณ Total จากช่องทาง
      totals.AC += item.AC || 0;

      editableChannels.forEach((channel) => {
        // แปลงค่าในช่องที่แก้ไขได้ให้เป็นตัวเลข
        totals[channel] += parseInt(item[channel]) || 0;
      });
    });

    return totals;
  }, [filteredData]);

  // --- Logic สำหรับการแบ่งหน้าและแสดงผล ---
  useEffect(() => {
    const newTotalPages = Math.ceil(filteredData.length / pageSize);
    setTotalPages(newTotalPages || 1);

    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (filteredData.length > 0 && currentPage === 0) {
      setCurrentPage(1);
    } else if (filteredData.length === 0) {
      setCurrentPage(1); // แสดงหน้า 1 เสมอ แม้ข้อมูลจะว่าง
    }
  }, [filteredData.length, pageSize, currentPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (value) => {
    const size = Number(value) || 20;
    setPageSize(size);
    setCurrentPage(1);
  };

  // Function จัดการการเปลี่ยนแปลงค่าในช่อง Input
  const handleValueChange = (code, channel, value) => {
    setIsDataChanged(true);

    const newData = data.map((item) => {
      if (item.Code === code) {
        // ให้เก็บค่าเป็น String ใน State แต่แสดงเป็นตัวเลข
        const rawValue = value.replace(/[^0-9]/g, ""); // 🚨 ปรับให้รับเฉพาะตัวเลข
        const numericValue = parseInt(rawValue) || 0;

        const updatedItem = { ...item, [channel]: rawValue };

        // ⚠️ อัปเดต Total
        updatedItem.Total = calculateTotal(updatedItem);

        return updatedItem;
      }
      return item;
    });
    setData(newData);
  };

  // Function จัดการการเปลี่ยนแปลง Class
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

  // Function สำหรับการยืนยันการเปลี่ยนแปลง (Submit)
  const handleSubmit = () => {
    if (!isDataChanged) {
      alert("ไม่พบการเปลี่ยนแปลงข้อมูล กรุณาแก้ไขข้อมูลก่อนบันทึก.");
      return;
    }

    // 🚨 ในโลกจริง ควรส่งเฉพาะข้อมูลที่เปลี่ยนแปลงไปยัง API
    console.log("Saving data:", data);
    alert("บันทึกข้อมูล Forecast Order สำเร็จ (Mock Save)");
    setIsDataChanged(false);
  };

  // สลับการซ่อน/แสดงคอลัมน์
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
    .filter(isColumnHidden)
    .map((c) => c.split("(")[0].trim())
    .join(", ");

  // --- UPDATED: Unified Filter Handler ---
  const handleFilterChange = (name, value) => {
    // 🚨 รองรับการส่ง Array ของ Class เข้ามาโดยตรง
    if (name === "class" && Array.isArray(value)) {
      setFilters((prev) => ({ ...prev, [name]: value }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
    setCurrentPage(1);
  };

  return (
    <>
      <div className="p-8 bg-white shadow-2xl rounded-xl">
        {/* --- Header with Title and Info --- */}
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
            Trade Shipping
          </h1>
          <p className="text-gray-500 ">
            **กำหนด/บันทึกยอดพยากรณ์การสั่งซื้อ** (Forecast Order)
            แยกตามช่องทางจำหน่าย (Channels) และแก้ไข Class สินค้า
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
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
                  <option value="TNP">TNP (Mock)</option>
                  <option value="TNS">TNS (Mock)</option>
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
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {/* 🚨 Class Filter (ใช้ Checkbox Popover) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Class
                </label>
                <ClassFilterDropdown
                  selectedClasses={filters.class}
                  onClassChange={(newClasses) =>
                    handleFilterChange("class", newClasses)
                  }
                  uniqueClasses={["All", ...availableClasses]}
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
            <div className="flex justify-between items-end mt-12 gap-4">
              <p className="text-sm text-gray-600 font-medium">
                พบสินค้า: <strong>{formatNumber(filteredData.length)}</strong>{" "}
                รายการ
              </p>
              <div className="flex gap-4">
                <ColumnToggleDropdown
                  hiddenColumnsList={hiddenColumnsList}
                  isColumnHidden={isColumnHidden}
                  toggleColumnVisibility={toggleColumnVisibility}
                  editableChannels={editableChannels}
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
            <thead className="bg-[#640037] text-nowrap text-white sticky top-0">
              <tr>
                {/* Fixed Columns */}
                <th className="p-3 bg-[#640037] sticky left-0 z-10 shadow-md min-w-[50px] border-r border-gray-500/30">
                  No.
                </th>
                <th className="p-3 bg-[#640037] sticky left-[50px] z-10 shadow-md min-w-[150px] border-r border-gray-500/30">
                  Code / Type
                </th>
                {/* Visible/Hideable Columns */}
                {!isColumnHidden("Description") && (
                  <th className="p-3 min-w-[250px] border-r border-gray-500/30">
                    Description
                  </th>
                )}
                {!isColumnHidden("Type") && (
                  <th className="p-3 min-w-[100px] border-r border-gray-500/30">
                    Type
                  </th>
                )}
                {!isColumnHidden("Class") && (
                  <th className="p-3 min-w-[120px] border-r border-gray-500/30">
                    Class
                  </th>
                )}
                {/* Total Columns */}
                <th className="p-3 min-w-[100px] border-r border-gray-500/30 font-bold">
                  Total FC
                </th>
                <th className="p-3 min-w-[100px] border-r border-gray-500/30 font-bold">
                  Total AC
                </th>
                {/* Editable Channel Headers */}
                {editableChannels.map((channel) =>
                  !isColumnHidden(channel) ? (
                    <th
                      key={channel}
                      className="p-3 border-r border-gray-500/30 whitespace-nowrap min-w-[120px]"
                    >
                      {channel}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>

            <tbody>
              {/* Grand Totals Row */}
              <tr className="bg-yellow-100/50 border-y border-yellow-700/50 font-bold text-yellow-800 sticky z-[5]">
                <td className="p-3 sticky left-0 bg-yellow-100/50 border-r border-gray-200 text-center font-extrabold text-sm min-w-[50px]">
                  SUM
                </td>
                <td className="p-3 sticky left-[50px] bg-yellow-100/50 border-r border-gray-200 text-center font-extrabold text-sm min-w-[150px]">
                  GRAND TOTALS
                </td>
                {!isColumnHidden("Description") && (
                  <td className="p-3 border-r border-gray-200"></td>
                )}
                {!isColumnHidden("Type") && (
                  <td className="p-3 border-r border-gray-200"></td>
                )}
                {!isColumnHidden("Class") && (
                  <td className="p-3 border-r border-gray-200"></td>
                )}
                <td className="p-3 font-extrabold text-lg text-red-600 border-r border-gray-200">
                  {formatNumber(grandTotals.Total)}
                </td>
                <td className="p-3 font-normal text-gray-600 border-r border-gray-200">
                  {formatNumber(grandTotals.AC)}
                </td>
                {editableChannels.map((channel) =>
                  !isColumnHidden(channel) ? (
                    <td
                      key={channel}
                      className="p-3 border-r border-gray-200 text-right"
                    >
                      {formatNumber(grandTotals[channel])}
                    </td>
                  ) : null
                )}
              </tr>

              {/* Table Body (ใช้ paginatedData) */}
              {paginatedData.map((item, index) => (
                <tr
                  key={item.Code + index}
                  className="border-b text-center border-gray-200 hover:bg-pink-50 transition duration-100"
                >
                  {/* No. */}
                  <td className="font-bold text-[#640037] p-3 text-sm border-r border-gray-200 sticky left-0 bg-white hover:bg-pink-50 transition duration-100 z-[1]">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  {/* Code */}
                  <td className="p-2 text-nowrap border-r border-gray-200 sticky left-[50px] bg-white hover:bg-pink-50 transition duration-100 z-[1]">
                    <span className="font-bold text-[#640037]">
                      {item.Code}
                    </span>
                  </td>

                  {/* Description */}
                  {!isColumnHidden("Description") && (
                    <td className="p-3 font-medium text-gray-700 border-r border-gray-200 text-left">
                      {item.Description}
                    </td>
                  )}
                  {/* Type */}
                  {!isColumnHidden("Type") && (
                    <td className="p-3 text-xs text-gray-700 border-r border-gray-200">
                      {item.Type}
                    </td>
                  )}
                  {/* Class Selector */}
                  {!isColumnHidden("Class") && (
                    <td className="p-1 border-r border-gray-200">
                      <select
                        value={item.Class}
                        onChange={(e) =>
                          handleClassChange(item.Code, e.target.value)
                        }
                        className="p-1 border border-gray-300 rounded focus:ring-pink-800 focus:border-pink-800 text-sm font-bold w-full"
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
                  <td className="p-3 font-extrabold text-red-600 border-r border-gray-200">
                    {formatNumber(item.Total)}
                  </td>
                  {/* Total AC (Mock) */}
                  <td className="p-3 font-normal text-gray-600 border-r border-gray-200">
                    {formatNumber(item.AC)}
                  </td>
                  {/* Editable Channel Inputs */}
                  {editableChannels.map((channel) =>
                    !isColumnHidden(channel) ? (
                      <td
                        key={channel}
                        className="p-1 border-r border-gray-200"
                      >
                        <input
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          min="0"
                          value={item[channel]}
                          onChange={(e) =>
                            handleValueChange(
                              item.Code,
                              channel,
                              e.target.value
                            )
                          }
                          className="w-full p-1 text-center border-b-2 border-pink-300 text-sm font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-900 focus:border-pink-800 focus:rounded-lg transition"
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
                จำนวนรายการที่พบ: {formatNumber(filteredData.length)}
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
                หน้า <strong>{formatNumber(currentPage)}</strong> /{" "}
                <strong>{formatNumber(totalPages)}</strong>
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50 transition"
                aria-label="ถัดไป"
              >
                ถัดไป
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
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
