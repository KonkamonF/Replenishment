import React, { useState, useMemo } from "react";
import { Search, Eye, EyeOff, ChevronDown } from "lucide-react"; // เพิ่ม ChevronDown

// --- Mock Data (คงเดิม) ---
const initialKeyFCData = [
  {
    Code: "20-0326-02",
    Description: "Gas regulator TNP R326S",
    Type: "ACC",
    Class: "A",
    Total: 2877,
    "Other(K Beer)": 0,
    "GBH Beer": 300,
    "GBH P Ann": 0,
    "HP Beer": 1500,
    "HP Online P Ann": 0,
    "HP P Ann": 0,
    BTV: 5,
    Dealer: 22,
    Dohome: 450,
    "The Mall": 0,
    TWD: 600,
    "Online All": 5,
  },
  {
    Code: "20-0150-1",
    Description: "Gas regulator TNS GH 150 B.0",
    Type: "ACC",
    Class: "MD",
    Total: 1602,
    "Other(K Beer)": 1299,
    "GBH Beer": 0,
    "GBH P Ann": 0,
    "HP Beer": 150,
    "HP Online P Ann": 2,
    "HP P Ann": 350,
    BTV: 20,
    Dealer: 28,
    Dohome: 100,
    "The Mall": 0,
    TWD: 500,
    "Online All": 0,
  },
  {
    Code: "09-10500-03",
    Description: "SINK TNS 10500 SS.06",
    Type: "Sink",
    Class: "A",
    Total: 1234,
    "Other(K Beer)": 70,
    "GBH Beer": 100,
    "GBH P Ann": 0,
    "HP Beer": 0,
    "HP Online P Ann": 0,
    "HP P Ann": 0,
    BTV: 50,
    Dealer: 41,
    Dohome: 120,
    "The Mall": 0,
    TWD: 500,
    "Online All": 1,
  },
  {
    Code: "20-0326-02",
    Description: "Gas regulator TNP R326S",
    Type: "ACC",
    Class: "A",
    Total: 2877,
    "Other(K Beer)": 0,
    "GBH Beer": 300,
    "GBH P Ann": 0,
    "HP Beer": 1500,
    "HP Online P Ann": 0,
    "HP P Ann": 0,
    BTV: 5,
    Dealer: 22,
    Dohome: 450,
    "The Mall": 0,
    TWD: 600,
    "Online All": 5,
  },
];
// -----------------

// ชื่อคอลัมน์ช่องทางจำหน่ายที่ต้องการแก้ไขได้
const editableChannels = [
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

export default function KeyFC() {
  const [data, setData] = useState(initialKeyFCData);
  const [isDataChanged, setIsDataChanged] = useState(false);

  // --- UPDATED: State สำหรับการกรองแบบแยกส่วน (เปลี่ยน Dropdown เป็น Text Search) ---
  const [liveSearch, setLiveSearch] = useState(""); // Input field value
  const [finalSearchTerm, setFinalSearchTerm] = useState(""); // Value used for filtering
  const [classFilter, setClassFilter] = useState("All"); // 'All' คือไม่กรอง
  // ------------------------------------------

  // --- State สำหรับซ่อนคอลัมน์ (คงเดิม) ---
  const [hiddenColumns, setHiddenColumns] = useState({});

  // --- NEW FUNCTION: Trigger Search ---
  const triggerSearch = () => {
    setFinalSearchTerm(liveSearch);
  };

  // --- UPDATED: Filtered Data (ใช้ useMemo เพื่อกรองหลายเงื่อนไข) ---
  const filteredData = useMemo(() => {
    let currentData = data;
    const lowerCaseSearch = finalSearchTerm.toLowerCase();

    // 1. กรองด้วย Item Search (Code หรือ Description)
    if (lowerCaseSearch) {
      currentData = currentData.filter((item) => 
          item.Code.toLowerCase().includes(lowerCaseSearch) || 
          item.Description.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // 2. กรองด้วย Class Filter
    if (classFilter !== "All") {
      currentData = currentData.filter((item) => item.Class === classFilter);
    }

    return currentData;
  }, [data, finalSearchTerm, classFilter]);
  // --------------------------------------------------------

  // --- คำนวณยอดรวมทั้งหมด (Grand Totals) สำหรับข้อมูลที่กรองแล้ว (คงเดิม) ---
  const grandTotals = useMemo(() => {
    const totals = { Total: 0 };
    editableChannels.forEach((channel) => (totals[channel] = 0));

    filteredData.forEach((item) => {
      totals.Total += item.Total;
      editableChannels.forEach((channel) => {
        totals[channel] += parseInt(item[channel]) || 0;
      });
    });
    return totals;
  }, [filteredData]);
  // ---------------------------------------------------------------------

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

  // Function จัดการการเปลี่ยนแปลง Class (เหมือนเดิม)
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

  // Function สำหรับการยืนยันการเปลี่ยนแปลง (Submit) (เหมือนเดิม)
  const handleSubmit = () => {
    if (!isDataChanged) {
      // ใช้ Modal แทน alert ในแอปจริง
      console.log("ไม่พบการเปลี่ยนแปลงข้อมูล กรุณาแก้ไขข้อมูลก่อนบันทึก.");
      return;
    }

    // ... API Call Logic ...
    console.log("Submitting the following forecast data:", data);
    // ใช้ Modal แทน alert ในแอปจริง
    console.log(
      `✅ ยืนยันการเปลี่ยนแปลงข้อมูล Forecast จำนวน ${data.length} รายการสำเร็จ! (ข้อมูลถูกส่งไปที่ Console)`
    );

    setIsDataChanged(false);
  };

  // --- Functions สำหรับ Toggle (คงเดิม) ---

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
  const hiddenColumnsList = hideableColumns.filter(isColumnHidden);
  // ----------------------------------------------------

  // --- Component สำหรับ Dropdown Toggle Column (คงเดิม) ---
  const ColumnToggleDropdown = () => {
    const allColumns = [
      { key: "Description", name: "Description" },
      { key: "Type", name: "Type" },
      { key: "Class", name: "Class" },
      ...editableChannels.map((c) => ({ key: c, name: c })),
    ];

    const hasHiddenColumns = allColumns.some((col) => isColumnHidden(col.key));

    
    return (
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() =>
            document.getElementById("column-menu").classList.toggle("hidden")
          }
          className={`inline-flex justify-center items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition duration-150 shadow-sm 
              ${
                hasHiddenColumns
                  ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
              }`}
        >
          {hasHiddenColumns ? <Eye /> : <EyeOff />}
          {hasHiddenColumns
            ? `Show/Hide Columns (${hiddenColumnsList.length})`
            : "Hide/Show Columns"}
        </button>

        <div
          id="column-menu"
          className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {allColumns.map((col) => (
              <div
                key={col.key}
                onClick={() => toggleColumnVisibility(col.key)}
                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition duration-100"
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
      </div>
    );
  };
  // ----------------------------------------------------

  const handleFilterChange = (name, value) => {
    // Update state based on filter type
    if (name === "search") {
      setLiveSearch(value);
    } else if (name === "class") {
      setClassFilter(value);
    } 
    // Mock other changes for completeness
    // Note: Other dropdowns (Brand, YN, Trade Status) are mock and not tied to state yet
  };

  return (
    <>
      <div className="p-6 bg-white shadow-2xl rounded-xl">
        {/* --- Header with Save Button --- */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h1 className="text-3xl font-extrabold text-[#640037]">
            Key Product Forecast (FC)
          </h1>
          <button
            onClick={handleSubmit}
            disabled={!isDataChanged}
            className={`px-5 py-2 rounded-lg font-semibold transition duration-300 shadow-md
              ${
                isDataChanged
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            {isDataChanged ? "💾 Save Forecast" : "No Changes"}
          </button>
        </div>

        <p className="text-gray-500 mb-4">
          ปรับปรุงยอดพยากรณ์การขายแยกตามช่องทางจำหน่าย (Channels) และแก้ไข Class
          สินค้า และใช้ช่อง **Filter Bar** ด้านบนเพื่อกรองข้อมูลเฉพาะเจาะจง
          และใช้ปุ่ม **Show/Hide Columns** ในการจัดการการแสดงคอลัมน์ในตาราง
        </p>

        {/* --- Filter Bar (ตามภาพ) --- */}
        <div className="p-4 bg-pink-50 rounded-lg shadow-inner mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
            {/* 1. ค้นหาสินค้า (Code/Desc) - เปลี่ยนเป็น Input พร้อมปุ่มค้นหา */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                ค้นหาสินค้า (Code/Desc)
              </label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="ค้นหา..."
                    value={liveSearch}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        triggerSearch();
                      }
                    }}
                    className="w-full p-2 pr-8 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 bg-white"
                  />
                  {/* ปุ่มล้างการค้นหา (X icon) */}
                  {liveSearch && (
                    <button
                      onClick={() => {
                        setLiveSearch('');
                        setFinalSearchTerm(''); // Clear filter state immediately
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 p-1"
                      title="ล้างการค้นหา"
                    >
                      &times;
                    </button>
                  )}
                </div>
                {/* ปุ่มค้นหาหลัก */}
                <button
                  onClick={triggerSearch}
                  className="p-2 bg-[#640037] text-white rounded-lg shadow-md hover:bg-[#50002b] transition flex items-center justify-center w-12 h-[42px]"
                  title="ค้นหา"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Brand (Mock Filter) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Brand (Mock)
              </label>
              <div className="relative">
                <select
                  // เพิ่ม appearance-none และ pr-10
                  className="w-full p-2 pr-10 text-gray-900 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm appearance-none"
                >
                  <option value="All">All</option>
                  <option value="TNP">TNP</option>
                  <option value="TNS">TNS</option>
                </select>
                {/* เพิ่มไอคอนลูกศร */}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 3. Class Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Class
              </label>
              <div className="relative">
                <select
                  value={classFilter}
                  onChange={(e) => handleFilterChange("class", e.target.value)}
                  // เพิ่ม appearance-none และ pr-10
                  className="w-full p-2 pr-10 text-gray-900 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm appearance-none"
                >
                  <option value="All">All</option>
                  {availableClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {/* เพิ่มไอคอนลูกศร */}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 4. YN Best 2025 (Mock Filter) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                YN Best 2025 (Mock)
              </label>
              <div className="relative">
                <select
                  // เพิ่ม appearance-none และ pr-10
                  className="w-full p-2 pr-10 text-gray-900 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm appearance-none"
                >
                  <option value="All">All</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
                {/* เพิ่มไอคอนลูกศร */}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 5. สถานะ Trade (Mock Filter) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                สถานะ Trade (Mock)
              </label>
              <div className="relative">
                <select
                  // เพิ่ม appearance-none และ pr-10
                  className="w-full p-2 pr-10 text-gray-900 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm appearance-none"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {/* เพิ่มไอคอนลูกศร */}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
        {/* --- End Filter Bar --- */}

        {/* --- Column Toggle Bar --- */}
        <div className="flex justify-end items-center mb-4 gap-4">
          <ColumnToggleDropdown />
        </div>

        {/* --- Data Table --- */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full table-auto border-collapse ">
            <thead className="bg-[#640037] text-white sticky top-0">
              <tr>
                {/* Code Header (Sticky) */}
                <th className="p-3 text-left w-[120px] left-0 bg-[#640037] z-30">
                  Code
                </th>

                {/* Description Header */}
                {!isColumnHidden("Description") && (
                  <th className="p-3 text-left w-[250px]">Description</th>
                )}

                {/* Type Header */}
                {!isColumnHidden("Type") && (
                  <th className="p-3 text-center w-[80px]">Type</th>
                )}

                {/* Class Header */}
                {!isColumnHidden("Class") && (
                  <th className="p-3 text-center w-[100px] border-l border-pink-700">
                    Class
                  </th>
                )}

                {/* Total FC Header (Non-Editable) */}
                <th className="p-3 text-right w-[120px] font-extrabold border-l border-pink-700">
                  Total FC
                </th>
                <th className="p-3 text-right w-[120px] font-extrabold border-l border-pink-700">
                  Total AC (Mock)
                </th>

                {/* Editable Channel Headers */}
                {editableChannels.map((channel) =>
                  !isColumnHidden(channel) ? (
                    <th
                      key={channel}
                      className="p-3 text-right w-[100px] text-xs font-normal border-l border-pink-700 whitespace-nowrap"
                    >
                      {channel}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>

            <tbody>
              {/* Table Body (ใช้ filteredData) */}
              {filteredData.map((item, index) => (
                <tr
                  key={item.Code + index} // ใช้ key ที่ Unique มากขึ้น
                  className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
                >
                  {/* Code (Sticky) */}
                  <td className="p-3 text-left font-mono text-sm left-0 bg-white hover:bg-pink-50 border-r border-gray-200 z-10">
                    {item.Code}
                  </td>

                  {/* Description */}
                  {!isColumnHidden("Description") && (
                    <td className="p-3 text-left font-semibold text-gray-700">
                      {item.Description}
                    </td>
                  )}

                  {/* Type */}
                  {!isColumnHidden("Type") && (
                    <td className="p-3 text-center text-xs text-gray-500">
                      {item.Type}
                    </td>
                  )}

                  {/* Class Selector */}
                  {!isColumnHidden("Class") && (
                    <td className="p-1 text-center border-l border-gray-200">
                      <select
                        value={item.Class}
                        onChange={(e) =>
                          handleClassChange(item.Code, e.target.value)
                        }
                        className="p-1 w-full text-center bg-transparent border border-gray-300 rounded focus:ring-pink-500 focus:border-pink-500 text-sm font-bold"
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
                  <td className="p-3 text-right font-extrabold text-lg text-red-600 border-l border-gray-200">
                    {item.Total.toLocaleString()}
                  </td>
                  {/* Total AC (Mock) */}
                  <td className="p-3 text-right font-normal text-gray-600 border-l border-gray-200">
                    {(item.Total * 0.9).toFixed(0).toLocaleString()}
                  </td>

                  {/* Editable Channel Inputs */}
                  {editableChannels.map((channel) =>
                    !isColumnHidden(channel) ? (
                      <td
                        key={channel}
                        className="p-1 text-center border-l border-gray-200"
                      >
                        <input
                          type="number"
                          min="0"
                          value={item[channel]}
                          onChange={(e) =>
                            handleValueChange(
                              item.Code,
                              channel,
                              e.target.value
                            )
                          }
                          className="w-full p-1 text-right border-b border-pink-300 focus:border-pink-600 focus:ring-0 text-sm font-medium transition duration-100"
                          style={{ backgroundColor: "transparent" }}
                        />
                      </td>
                    ) : null
                  )}
                </tr>
              ))}
            </tbody>

            {/* --- Table Footer for Totals (คำนวณจาก filteredData) --- */}
            <tfoot className="bg-pink-100 border-t-4 border-[#640037] sticky bottom-0">
              <tr>
                {/* Grand Total Label */}
                <th
                  colSpan={
                    1 + // Code
                    (isColumnHidden("Description") ? 0 : 1) +
                    (isColumnHidden("Type") ? 0 : 1) +
                    (isColumnHidden("Class") ? 0 : 1)
                  }
                  className="p-3 text-right font-extrabold text-lg text-[#640037] sticky left-0 bg-pink-100 z-20"
                >
                  GRAND TOTAL:
                </th>

                {/* Grand Total FC & AC (AC is Mock) */}
                <th className="p-3 text-right font-extrabold text-xl text-red-800 border-l border-[#640037]">
                  {grandTotals.Total.toLocaleString()}
                </th>
                 <th className="p-3 text-right font-extrabold text-xl text-red-800 border-l border-[#640037]">
                  {(grandTotals.Total * 0.9).toFixed(0).toLocaleString()}
                </th>

                {/* Grand Totals by Channel */}
                {editableChannels.map((channel) =>
                  !isColumnHidden(channel) ? (
                    <th
                      key={`total-${channel}`}
                      className="p-3 text-right font-bold text-sm text-gray-800 border-l border-[#640037] whitespace-nowrap"
                    >
                      {grandTotals[channel].toLocaleString()}
                    </th>
                  ) : null
                )}
              </tr>
            </tfoot>
          </table>
          {/* แสดงเมื่อไม่มีข้อมูล */}
          {filteredData.length === 0 && (
            <div className="p-4 text-center text-gray-500 bg-white">
              ไม่พบข้อมูลตามเงื่อนไขการค้นหา
            </div>
          )}
        </div>

        {/* ... Information Box (คงเดิม) ... */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p>
            ⚠️ **หมายเหตุ:** ข้อมูล **Total FC**
            จะถูกคำนวณอัตโนมัติจากผลรวมของยอดขายตามช่องทางจำหน่ายที่ท่านกรอก
          </p>
          <p>
            💡 **การใช้งาน:** ใช้ **Dropdown**
            ในแถบตัวกรองเพื่อเลือกดูข้อมูลสินค้าเฉพาะรายการ
            และใช้ปุ่ม **Show/Hide Columns** เพื่อจัดการการแสดงคอลัมน์ในตาราง
          </p>
        </div>
      </div>
    </>
  );
}
