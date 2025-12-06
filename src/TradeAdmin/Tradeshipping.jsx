import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Eye, EyeOff, ChevronDown, Save } from "lucide-react";

// --- Configuration: คอลัมน์ที่เหลือจากตารางภาษาไทย ---

// 1. คอลัมน์ที่เหลืออยู่จากตารางหลัก (เหล่านี้จะกลายเป็นคอลัมน์ที่แสดงผลหลักและบางส่วนจะแก้ไขได้)
const coreInventorySalesColumns = [
  "Code", 
  "Supplier", 
  "Type", 
  "Cost", 
  "Order QTY", 
  "Stock คลังเหลือหักจอง", 
  "PO On Hand", 
  "ตัดจ่ายเฉลี่ยย้อนหลัง 3 เดือน", 
  "ตัดจ่ายเฉลี่ยย้อนหลัง 6 เดือน", 
  "ตัดจ่าย M1 - M6", 
  "FC เดือนก่อนหน้า", 
  "FC เดือนปัจจุบัน", 
  "FC เดือนถัดไป", 
  "Trade"
];

// 2. คอลัมน์ที่ผู้ใช้ควรแก้ไขได้โดยตรง (สมมติให้ Cost, Order QTY, Stock, PO, FC ปัจจุบัน/ถัดไป แก้ไขได้)
const editableFields = [
    "Cost",
    "Order QTY",
    "Stock คลังเหลือหักจอง",
    "PO On Hand",
    "FC เดือนปัจจุบัน",
    "FC เดือนถัดไป",
];

// 3. คอลัมน์ที่คำนวณอัตโนมัติ (DOH)
const calculatedColumns = [
  "DOH (Stock : FC)", 
  "DOH (Stock + Order : FC)"
];

// 4. คอลัมน์ทั้งหมดที่สามารถซ่อน/แสดงได้ (ยกเว้น Code, Supplier, Trade, Type, Description, Class)
const hideableColumns = [
  "Cost", 
  "Order QTY", 
  "Stock คลังเหลือหักจอง", 
  "PO On Hand",
  "ตัดจ่ายเฉลี่ยย้อนหลัง 3 เดือน",
  "ตัดจ่ายเฉลี่ยย้อนหลัง 6 เดือน",
  "ตัดจ่าย M1 - M6",
  "FC เดือนก่อนหน้า",
  "FC เดือนปัจจุบัน",
  "FC เดือนถัดไป",
  ...calculatedColumns,
  "Description",
  "Type",
  "Class", 
];

const availableClasses = ["A", "B", "C", "D", "MD", "N"];

// --- Helper Functions (ย้ายขึ้นมาแก้ไข ReferenceError) ---

// Helper function คำนวณ Total FC ใหม่ (เนื่องจากลบ editableChannels แล้ว จึงใช้ FC เดือนปัจจุบันแทน)
const calculateTotal = (item) => {
  // Total FC = FC เดือนปัจจุบัน (สมมติฐานใหม่)
  return parseInt(item["FC เดือนปัจจุบัน"]) || 0;
};

// Helper function สำหรับจัดรูปแบบตัวเลข (เพิ่มการรองรับ DOH ที่มีทศนิยม 1 ตำแหน่ง)
const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || num === "") return "-";
  const n = Number(num);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
};

// --- Mock Data Generation (ปรับปรุงให้มีคอลัมน์ใหม่) ---

const initialKeyFCData = Array.from({ length: 200 }, (_, i) => {
  const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const code = `09-55555-${(i + 1).toString().padStart(3, "0")}`;
  const description = `KITCHEN HOOD TNP 70 - ${i + 1}`;
  const type = i % 3 === 0 ? "ACC" : i % 3 === 1 ? "Sink" : "Hood";
  const classVal = ["A", "B", "C", "MD", "N"][i % 5];
  
  const totalAC = rand(5500, 6500); 

  // Mock Data สำหรับคอลัมน์ Inventory และ Sales
  const newColsData = {
    "Cost": rand(100, 1500).toString(),
    "Order QTY": rand(10, 50).toString(),
    "Stock คลังเหลือหักจอง": rand(50, 200).toString(),
    "PO On Hand": rand(10, 100).toString(),
    "ตัดจ่ายเฉลี่ยย้อนหลัง 3 เดือน": rand(80, 150).toString(),
    "ตัดจ่ายเฉลี่ยย้อนหลัง 6 เดือน": rand(120, 200).toString(),
    "ตัดจ่าย M1 - M6": rand(200, 400).toString(),
    "FC เดือนก่อนหน้า": rand(150, 300).toString(),
    "FC เดือนปัจจุบัน": rand(200, 400).toString(),
    "FC เดือนถัดไป": rand(180, 350).toString(),
    "Trade": ["Trade A", "Trade B", "Trade C"][i % 3], 
    "Supplier": `Supplier ${i % 5 + 1}`, 
    "Class": classVal, // Class
    "Description": description, // Description
    "Type": type, // Type
  };

  // รวมข้อมูลทั้งหมด
  const baseItem = {
    Code: code,
    AC: totalAC, // Total AC
    ...newColsData,
  };

  // คำนวณ Total FC เริ่มต้น (FC เดือนปัจจุบัน)
  baseItem.Total = calculateTotal(baseItem);
  
  // คำนวณ DOH (Days On Hand)
  const stock = parseInt(baseItem["Stock คลังเหลือหักจอง"]) || 0;
  const poOnHand = parseInt(baseItem["PO On Hand"]) || 0;
  const fcCurrent = parseInt(baseItem["FC เดือนปัจจุบัน"]) || 0;
  const orderQty = parseInt(baseItem["Order QTY"]) || 0;

  // DOH (Stock : FC) = (Stock + Po On Hand) / FC เดือนปัจจุบัน
  baseItem["DOH (Stock : FC)"] = 
    fcCurrent > 0 ? ((stock + poOnHand) / fcCurrent) : "-";

  // DOH (Stock + Order : FC) = (Stock + Po On Hand + Order) / FC เดือนปัจจุบัน
  baseItem["DOH (Stock + Order : FC)"] = 
    fcCurrent > 0 ? ((stock + poOnHand + orderQty) / fcCurrent) : "-";

  return baseItem;
});

// --- Component สำหรับ Dropdown Toggle Column (ปรับให้รองรับคอลัมน์ใหม่) ---

const ColumnToggleDropdown = ({
  hiddenColumnsList,
  isColumnHidden,
  toggleColumnVisibility,
}) => {
  // รวมคอลัมน์ทั้งหมดที่ซ่อน/แสดงได้ พร้อมชื่อที่ใช้แสดง
  const allColumns = [
    { key: "Description", name: "Description" },
    { key: "Type", name: "Type" },
    { key: "Class", name: "Class" },
    // คอลัมน์ Inventory/Sales 
    { key: "Cost", name: "Cost" },
    { key: "Order QTY", name: "Order QTY" },
    { key: "Stock คลังเหลือหักจอง", name: "Stock" },
    { key: "PO On Hand", name: "PO On Hand" },
    { key: "ตัดจ่ายเฉลี่ยย้อนหลัง 3 เดือน", name: "Sales Avg 3M" },
    { key: "ตัดจ่ายเฉลี่ยย้อนหลัง 6 เดือน", name: "Sales Avg 6M" },
    { key: "ตัดจ่าย M1 - M6", name: "Sales M1-M6" },
    { key: "FC เดือนก่อนหน้า", name: "FC Prev Month" },
    { key: "FC เดือนปัจจุบัน", name: "FC Current Month" },
    { key: "FC เดือนถัดไป", name: "FC Next Month" },
    { key: "DOH (Stock : FC)", name: "DOH (S:FC)" },
    { key: "DOH (Stock + Order : FC)", name: "DOH (S+O:FC)" },
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

// --- Component สำหรับ Class Filter Checkbox Popover (คงเดิม) ---

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
      if (
        selectedClasses.length === classesWithoutAll.length ||
        selectedClasses.length === 0
      ) {
        onClassChange([]);
      } else {
        onClassChange(classesWithoutAll);
      }
    } else {
      if (selectedClasses.includes(value)) {
        const newSelection = selectedClasses.filter((c) => c !== value);
        onClassChange(newSelection);
      } else {
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

  // List of all column keys 
  const allDataKeys = useMemo(() => [
    "Code",
    "Supplier",
    "Trade",
    "Description",
    "Type",
    "Class",
    "Total", // Total FC
    "AC", // Total AC
    ...calculatedColumns,
    // กรองเอาคอลัมน์ Inventory/Sales ที่ไม่ซ้ำซ้อนกับคอลัมน์ Fixed หลัก
    ...coreInventorySalesColumns.filter(c => !["Code", "Supplier", "Type", "Trade"].includes(c)),
  ], []);


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

    // 2. กรองด้วย Class Filter
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
      const searchBrand = filters.brand.toLowerCase();
      currentData = currentData.filter(
        (item) =>
          item.Code.toLowerCase().startsWith(searchBrand) ||
          item.Description.toLowerCase().includes(searchBrand)
      );
    }

    return currentData;
  }, [data, filters]);

  // คำนวณ Grand Totals 
  const grandTotals = useMemo(() => {
    const totals = allDataKeys.reduce((acc, key) => {
      // ไม่รวมคอลัมน์ที่ไม่ใช่ผลรวม
      if (key.includes("DOH") || ["Code", "Supplier", "Trade", "Description", "Type", "Class"].includes(key) || key.includes("Cost")) {
        return acc; 
      }
      acc[key] = 0;
      return acc;
    }, {});

    // เพิ่ม Total, AC
    totals["Total"] = 0; // Total FC 
    totals["AC"] = 0; // Total AC (Actual)
    
    // เพิ่มคอลัมน์ Inventory/FC ที่ต้องรวม
    coreInventorySalesColumns.filter(c => !["Code", "Supplier", "Type", "Trade", "Cost"].includes(c)).forEach(key => {
        totals[key] = 0;
    });

    filteredData.forEach((item) => {
      totals.Total += calculateTotal(item); 
      totals.AC += item.AC || 0;

      // รวมคอลัมน์ Inventory/Sales (ที่เป็นตัวเลข)
      coreInventorySalesColumns.filter(c => !["Code", "Supplier", "Type", "Trade", "Cost"].includes(c)).forEach((key) => {
          totals[key] += parseInt(item[key]) || 0;
      });
    });

    return totals;
  }, [filteredData, allDataKeys]);

  // --- Logic สำหรับการแบ่งหน้าและแสดงผล (คงเดิม) ---

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredData.length / pageSize);
    setTotalPages(newTotalPages || 1);

    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (filteredData.length > 0 && currentPage === 0) {
      setCurrentPage(1);
    } else if (filteredData.length === 0) {
      setCurrentPage(1); 
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

  // Function จัดการการเปลี่ยนแปลงค่าในช่อง Input (ปรับปรุงการคำนวณ Total FC และ DOH)
  const handleValueChange = (code, field, value) => {
    setIsDataChanged(true);

    const newData = data.map((item) => {
      if (item.Code === code) {
        // จัดการเฉพาะคอลัมน์ที่เป็นตัวเลข
        const rawValue = value.replace(/[^0-9.]/g, ""); 
        const updatedItem = { ...item, [field]: rawValue };
        
        // อัปเดต Total FC และ DOH (ถ้าช่องที่แก้ไขเป็นช่องที่เกี่ยวข้อง)
        if (field === "FC เดือนปัจจุบัน" ||
            field === "Stock คลังเหลือหักจอง" ||
            field === "PO On Hand" ||
            field === "Order QTY") 
        {
            // Total FC อ้างอิงจาก FC เดือนปัจจุบัน (สมมติฐานใหม่)
            if(field === "FC เดือนปัจจุบัน") {
                updatedItem.Total = calculateTotal(updatedItem); 
            }

            // คำนวณ DOH ใหม่
            const stock = parseInt(updatedItem["Stock คลังเหลือหักจอง"]) || 0;
            const poOnHand = parseInt(updatedItem["PO On Hand"]) || 0;
            const fcCurrent = parseInt(updatedItem["FC เดือนปัจจุบัน"]) || 0;
            const orderQty = parseInt(updatedItem["Order QTY"]) || 0;

            updatedItem["DOH (Stock : FC)"] = 
              fcCurrent > 0 ? ((stock + poOnHand) / fcCurrent) : "-";

            updatedItem["DOH (Stock + Order : FC)"] = 
              fcCurrent > 0 ? ((stock + poOnHand + orderQty) / fcCurrent) : "-";
        }

        return updatedItem;
      }
      return item;
    });
    setData(newData);
  };

  // Function จัดการการเปลี่ยนแปลง Class (คงเดิม)
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

  // Function สำหรับการยืนยันการเปลี่ยนแปลง (Submit) (คงเดิม)
  const handleSubmit = () => {
    if (!isDataChanged) {
      alert("ไม่พบการเปลี่ยนแปลงข้อมูล กรุณาแก้ไขข้อมูลก่อนบันทึก.");
      return;
    }

    console.log("Saving data:", data);
    alert("บันทึกข้อมูล Forecast Order สำเร็จ (Mock Save)");
    setIsDataChanged(false);
  };

  // สลับการซ่อน/แสดงคอลัมน์ (คงเดิม)
  const toggleColumnVisibility = (column) => {
    setHiddenColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Function ตรวจสอบว่าคอลัมน์ถูกซ่อนหรือไม่ (คงเดิม)
  const isColumnHidden = (columnKey) => !!hiddenColumns[columnKey];

  // คอลัมน์ที่ถูกซ่อนอยู่ (คงเดิม)
  const hiddenColumnsList = hideableColumns
    .filter(isColumnHidden)
    .map((c) => c.split("(")[0].trim())
    .join(", ");

  // Unified Filter Handler (คงเดิม)
  const handleFilterChange = (name, value) => {
    if (name === "class" && Array.isArray(value)) {
      setFilters((prev) => ({ ...prev, [name]: value }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
    setCurrentPage(1);
  };

  // --- Header Definitions (ชื่อคอลัมน์ภาษาไทย) ---
  const headerMap = {
      "Code": "รหัสสินค้า",
      "Supplier": "ชื่อ Supplier",
      "Type": "ประเภทสินค้า",
      "Cost": "ราคาทุน (฿, $, €)",
      "Order QTY": "จำนวนสั่งซื้อ",
      "Stock คลังเหลือหักจอง": "Stock",
      "PO On Hand": "PO On Hand",
      "ตัดจ่ายเฉลี่ยย้อนหลัง 3 เดือน": "Sales Avg 3M",
      "ตัดจ่ายเฉลี่ยย้อนหลัง 6 เดือน": "Sales Avg 6M",
      "ตัดจ่าย M1 - M6": "Sales M1-M6",
      "FC เดือนก่อนหน้า": "FC Prev",
      "FC เดือนปัจจุบัน": "FC Current",
      "FC เดือนถัดไป": "FC Next",
      "DOH (Stock : FC)": "DOH (S:FC)",
      "DOH (Stock + Order : FC)": "DOH (S+O:FC)",
      "Trade": "Trade ที่ดูแล",
      "Description": "Description",
      "Class": "Class",
      "Total": "Total FC", // Total FC (อิงจาก FC เดือนปัจจุบัน)
      "AC": "Total AC", 
  };

  // --- Render (แสดงผล) ---

  return (
    <>
      <div className="p-8 bg-white shadow-2xl rounded-xl">
        {/* --- Header with Title and Info --- */}
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
            Trade Shipping Order Forecast 🚛
          </h1>
          <p className="text-gray-500 ">
            กำหนด/บันทึกข้อมูล Inventory, Sales และ Forecast Order 
          </p>
        </header>

        {/* 1. Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
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
              {/* Class Filter */}
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
                />
                <button
                  onClick={handleSubmit}
                  disabled={!isDataChanged}
                  className={`px-4 py-2 rounded-lg font-semibold shadow-lg text-sm transition duration-200 flex items-center gap-1
                                        ${
                                          isDataChanged
                                            ? "bg-green-600 text-white hover:bg-green-700 transform hover:scale-105"
                                            : "bg-gray-200 text-gray-600 cursor-not-allowed"
                                        }`}
                >
                  <Save className="w-4 h-4" />
                  {isDataChanged ? "Save Data" : "No Changes"}
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
                {/* Fixed Columns: No., Code/Supplier/Trade */}
                <th className="p-3 bg-[#640037] sticky left-0 z-10 shadow-md min-w-[50px] border-r border-gray-500/30">
                  No.
                </th>
                <th className="p-3 bg-[#640037] sticky left-[50px] z-10 shadow-md min-w-[200px] border-r border-gray-500/30">
                  {/* 🚨 แก้ไข Header ให้รวม Code / Supplier / Trade */}
                  {headerMap["Code"]} / {headerMap["Supplier"]} / <span className="font-bold">{headerMap["Trade"]}</span>
                </th>
                
                {/* Visible/Hideable Columns (Description, Type, Class) */}
                {!isColumnHidden("Description") && (
                  <th className="p-3 min-w-[250px] border-r border-gray-500/30">
                    {headerMap["Description"]}
                  </th>
                )}
                {!isColumnHidden("Type") && (
                  <th className="p-3 min-w-[100px] border-r border-gray-500/30">
                    {headerMap["Type"]}
                  </th>
                )}
                {!isColumnHidden("Class") && (
                  <th className="p-3 min-w-[120px] border-r border-gray-500/30">
                    {headerMap["Class"]}
                  </th>
                )}
                
                {/* Total Columns (FC & AC) */}
                <th className="p-3 min-w-[100px] border-r border-gray-500/30 font-bold bg-pink-800">
                  {headerMap["Total"]}
                </th>
                <th className="p-3 min-w-[100px] border-r border-gray-500/30 font-bold bg-pink-800">
                  {headerMap["AC"]}
                </th>
                
                {/* DOH Columns (New) */}
                <th className="p-3 min-w-[100px] border-r border-gray-500/30 bg-purple-800">
                  {headerMap["DOH (Stock : FC)"]}
                </th>
                <th className="p-3 min-w-[100px] border-r border-gray-500/30 bg-purple-800">
                  {headerMap["DOH (Stock + Order : FC)"]}
                </th>

                {/* Inventory/Sales Columns */}
                {coreInventorySalesColumns.filter(c => !["Code", "Supplier", "Type", "Trade"].includes(c)).map((col) => 
                  !isColumnHidden(col) ? (
                    <th key={col} className={`p-3 border-r border-gray-500/30 whitespace-nowrap min-w-[120px] ${editableFields.includes(col) ? 'bg-red-800' : 'bg-sky-800'}`}>
                        {headerMap[col]}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>

            <tbody>
              {/* Grand Totals Row */}
              <tr className="bg-yellow-100/50 border-y border-yellow-700/50 font-bold text-yellow-800 sticky z-[5]">
                <td className="p-3 sticky left-0 bg-yellow-100 border-r border-gray-200 text-center font-extrabold text-sm min-w-[50px]">
                  SUM
                </td>
                <td className="p-3 sticky left-[50px] bg-yellow-100 border-r border-gray-200 text-left font-extrabold text-sm min-w-[200px]">
                  GRAND TOTALS
                </td>
                
                {/* Skip Hideable/Editable Columns that are not totals */}
                {!isColumnHidden("Description") && (<td className="p-3 border-r border-gray-200"></td>)}
                {!isColumnHidden("Type") && (<td className="p-3 border-r border-gray-200"></td>)}
                {!isColumnHidden("Class") && (<td className="p-3 border-r border-gray-200"></td>)}
                
                {/* Total FC & AC */}
                <td className="p-3 font-extrabold text-lg text-red-600 border-r border-gray-200 bg-yellow-200/50">
                  {formatNumber(grandTotals.Total)}
                </td>
                <td className="p-3 font-normal text-gray-600 border-r border-gray-200 bg-yellow-200/50">
                  {formatNumber(grandTotals.AC)}
                </td>

                {/* DOH Totals (N/A for Grand Total, put "-" or empty) */}
                <td className="p-3 border-r border-gray-200 bg-yellow-200/50"> - </td>
                <td className="p-3 border-r border-gray-200 bg-yellow-200/50"> - </td>
                
                {/* Inventory/Sales Totals */}
                {coreInventorySalesColumns.filter(c => !["Code", "Supplier", "Type", "Trade"].includes(c)).map((col) => 
                  !isColumnHidden(col) ? (
                    <td 
                      key={col} 
                      className="p-3 border-r border-gray-200 text-right bg-yellow-200/50"
                    >
                      {col.includes("Cost") ? "-" : formatNumber(grandTotals[col])} 
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
                  {/* Code / Supplier / Trade */}
                  <td className="p-2 text-nowrap border-r border-gray-200 sticky left-[50px] bg-white hover:bg-pink-50 transition duration-100 z-[1] text-left">
                    <span className="font-bold text-[#640037]">
                      {item.Code}
                    </span>
                    <br/>
                    <span className="text-xs text-gray-500">
                      {item.Supplier} / <span className="font-medium text-gray-700">{item.Trade}</span>
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

                  {/* DOH Columns (New) */}
                  <td className="p-3 text-sm text-blue-600 border-r border-gray-200 font-bold">
                    {formatNumber(item["DOH (Stock : FC)"], 1)}
                  </td>
                  <td className="p-3 text-sm text-blue-600 border-r border-gray-200 font-bold">
                    {formatNumber(item["DOH (Stock + Order : FC)"], 1)}
                  </td>

                  {/* Inventory/Sales Columns (Editable/Display) */}
                  {coreInventorySalesColumns.filter(c => !["Code", "Supplier", "Type", "Trade"].includes(c)).map((col) => 
                      !isColumnHidden(col) ? (
                        <td key={col} className="p-1 border-r border-gray-200 text-right">
                            {editableFields.includes(col)
                                ? (<input
                                      type="text"
                                      pattern="[0-9.]*"
                                      inputMode="numeric"
                                      min="0"
                                      value={item[col]}
                                      onChange={(e) =>
                                          handleValueChange(
                                              item.Code,
                                              col,
                                              e.target.value
                                          )
                                      }
                                      className="w-full p-1 text-center border-b-2 border-red-300 text-sm font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-800 focus:rounded-lg transition"
                                      style={{ backgroundColor: "transparent" }}
                                  />) 
                                : formatNumber(item[col]) // คอลัมน์ที่เหลือเป็นค่าแสดงผลเท่านั้น
                            }
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

        {/* --- Information Box --- */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 shadow-inner">
          <p className="mb-2">
            ⚠️ **หมายเหตุ:** ข้อมูล **Total FC** ถูกคำนวณจากค่า **FC เดือนปัจจุบัน** (สมมติฐานใหม่)
          </p>
          <p className="mb-2">
            ✏️ **ช่องแก้ไขได้** ถูกเน้นด้วยสีพื้นหลังสีแดงใน Header
            ได้แก่: **Cost**, **Order QTY**, **Stock**, **PO On Hand**, **FC เดือนปัจจุบัน**, **FC เดือนถัดไป**
          </p>
          <p>
            📊 **DOH (Days On Hand)** จะถูกคำนวณอัตโนมัติเมื่อมีการเปลี่ยนแปลงค่า Stock, PO On Hand, Order QTY หรือ FC เดือนปัจจุบัน
            (แสดงผลเป็นทศนิยม 1 ตำแหน่ง)
          </p>
        </div>
      </div>
    </>
  );
}