import React, { useState, useMemo } from "react";
import { Search, Eye, EyeOff, ChevronDown } from "lucide-react";

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
    Code: "09-55555-55",
    Description: "KITCHEN HOOD TNP 70",
    Type: "Hood",
    Class: "B",
    Total: 5500,
    "Other(K Beer)": 500,
    "GBH Beer": 500,
    "GBH P Ann": 100,
    "HP Beer": 1000,
    "HP Online P Ann": 500,
    "HP P Ann": 500,
    BTV: 100,
    Dealer: 500,
    Dohome: 500,
    "The Mall": 100,
    TWD: 500,
    "Online All": 500,
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

// --- Component สำหรับ Dropdown Toggle Column (คงเดิม) ---
const ColumnToggleDropdown = ({
  hiddenColumnsList,
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

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() =>
          document.getElementById("column-menu").classList.toggle("hidden")
        }
        className={`inline-flex justify-center items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 shadow-md 
           ${
             hasHiddenColumns
               ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
               : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
           }`}
      >
        {hasHiddenColumns ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
        {`Show/Hide Columns ${
          hasHiddenColumns ? `(${hiddenColumnsList.split(", ").length})` : ""
        }`}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      <div
        id="column-menu"
        className="hidden origin-top-right absolute right-0 mt-2 w-72 rounded-lg shadow-2xl bg-white ring-1 ring-pink-800 ring-opacity-20 focus:outline-none z-50"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
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
    </div>
  );
};

// --- Summary Metrics Component ---
const SummaryMetrics = ({ grandTotals, filteredDataLength, dataLength }) => {
  const totalAC = (grandTotals.Total * 0.9).toFixed(0).toLocaleString();

  return (
    <div className="mb-6 p-4 bg-[#640037] rounded-xl shadow-2xl text-white">
      <h2 className="text-xl font-bold mb-3 border-b border-pink-400 pb-2">
        SUMMARY FC / AC
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-pink-700/50 rounded-lg">
          <p className="text-sm font-medium">Total FC (All Channels)</p>
          <p className="text-2xl font-extrabold text-red-300">
            {grandTotals.Total.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-pink-700/50 rounded-lg">
          <p className="text-sm font-medium">Total AC (Mock)</p>
          <p className="text-2xl font-extrabold text-red-300">{totalAC}</p>
        </div>
        <div className="p-3 bg-pink-700/50 rounded-lg">
          <p className="text-sm font-medium">Items Displayed</p>
          <p className="text-2xl font-extrabold">
            {filteredDataLength.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-pink-700/50 rounded-lg">
          <p className="text-sm font-medium">Total Items in Data</p>
          <p className="text-2xl font-extrabold">
            {dataLength.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function KeyFC() {
  const [data, setData] = useState(initialKeyFCData);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [filters, setFilters] = useState({
    search: "", // ใช้สำหรับ Text Search (Code/Desc)
    class: "All",
    brand: "All",
    ynBest: "All",
    type: "All",
  });
  const [hiddenColumns, setHiddenColumns] = useState({});

  // --- Filtered Data (ใช้ useMemo เพื่อกรองหลายเงื่อนไข) ---
  const filteredData = useMemo(() => {
    let currentData = data;
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
    if (filters.class !== "All") {
      currentData = currentData.filter((item) => item.Class === filters.class);
    }

    // 3. Mock Type Filter (Type)
    if (filters.type !== "All") {
      currentData = currentData.filter((item) => item.Type === filters.type);
    }

    return currentData;
  }, [data, filters]);

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

  // Function จัดการการเปลี่ยนแปลงค่าในช่อง Input (คงเดิม)
  const handleValueChange = (code, channel, value) => {
    setIsDataChanged(true);

    const newData = data.map((item) => {
      // ใช้ Code เป็น Unique Identifier
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

  // Function สำหรับการยืนยันการเปลี่ยนแปลง (Submit) (พร้อม Mock Logic)
  const handleSubmit = () => {
    if (!isDataChanged) {
      console.log("ไม่พบการเปลี่ยนแปลงข้อมูล กรุณาแก้ไขข้อมูลก่อนบันทึก.");
      return;
    }

    // Mock Save Process
    console.log("Saving data:", data);

    // After successful save, reset change state
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
  const hiddenColumnsList = hideableColumns
    .filter(isColumnHidden)
    .map((c) => c.split("(")[0].trim()) // ตัดส่วนในวงเล็บออกเพื่อความกระชับ
    .join(", ");

  // --- UPDATED: Unified Filter Handler ---
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // คำนวณจำนวนคอลัมน์ที่ไม่ใช่ Total/AC/Editable Channels ที่แสดงอยู่
  const nonEditableVisibleCols =
    1 + // Code
    (isColumnHidden("Description") ? 0 : 1) +
    (isColumnHidden("Type") ? 0 : 1) +
    (isColumnHidden("Class") ? 0 : 1);

  // คำนวณจำนวนคอลัมน์ที่จะรวมใน Grand Total (นับถึง Class)
  const totalColsForGrandTotalLabel = nonEditableVisibleCols;

  return (
    <>
      <div className="p-8 bg-white shadow-2xl rounded-xl ">
        {/* --- Header with Title and Info --- */}
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
            Key Product Forecast (FC) Editor
          </h1>
          <p className="text-gray-500">
            ปรับปรุงยอดพยากรณ์การขายแยกตามช่องทางจำหน่าย (Channels) และแก้ไข
            Class สินค้า
          </p>
        </header>

        {/* --- 1. GRAND TOTAL SUMMARY (ย้ายมาอยู่บนสุด) --- */}
        <SummaryMetrics
          grandTotals={grandTotals}
          filteredDataLength={filteredData.length}
          dataLength={data.length}
        />
        {/* --- END GRAND TOTAL SUMMARY --- */}

        {/* --- Filter Bar --- */}
        <div className="p-4 bg-pink-50 rounded-lg shadow-inner mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* 1. ค้นหาสินค้า (Code/Desc) - Real-time filtering */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                ค้นหาสินค้า (Code/Desc)
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="p-2 pl-9 pr-8 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 bg-white w-full"
                  // ^^^^^^ เพิ่ม w-full ที่นี่
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

            {/* 2. Brand (Mock Filter) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Brand
              </label>
              <div className="relative w-full">
                <select
                  value={filters.brand} // ผูกกับ filters.brand
                  onChange={(e) => handleFilterChange("brand", e.target.value)} // กรองทันที
                  // *** เพิ่ม w-full ที่นี่ ***
                  className="p-2 pr-10 text-gray-900 border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm w-full"
                >
                  <option value="All">All</option>
                  <option value="TNP">TNP</option>
                  <option value="TNS">TNS</option>
                </select>
                {/* เพิ่มไอคอนลูกศร */}
              </div>
            </div>

            {/* 3. Type Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Type
              </label>
              <div className="relative">
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  // *** เพิ่ม w-full ที่นี่ ***
                  className="p-2 pr-10 text-gray-900 border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm w-full"
                >
                  <option value="All">All</option>
                  <option value="ACC">ACC</option>
                  <option value="Sink">Sink</option>
                  <option value="Hood">Hood</option>
                </select>
              </div>
            </div>

            {/* 4. Class Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Class
              </label>
              <div className="relative ">
                <select
                  value={filters.class} // ผูกกับ filters.class
                  onChange={(e) => handleFilterChange("class", e.target.value)} // กรองทันที
                  // *** เพิ่ม w-full ที่นี่ ***
                  className="p-2 pr-10 text-gray-900 border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm w-full"
                >
                  <option value="All">All</option>
                  {availableClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. YN Best 2025 (Mock Filter) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                YN Best 2025 (Mock)
              </label>
              <div className="relative ">
                <select
                  value={filters.ynBest}
                  onChange={(e) => handleFilterChange("ynBest", e.target.value)}
                  // *** เพิ่ม w-full ที่นี่ ***
                  className="p-2 pr-10 text-gray-900 border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-pink-500 bg-white shadow-sm w-full"
                >
                  <option value="All">All</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* --- End Filter Bar --- */}

        {/* --- Column Toggle Bar & Save Button --- */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div className="flex gap-4">
            <ColumnToggleDropdown
              hiddenColumnsList={hiddenColumnsList}
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

        {/* --- Data Table --- */}
        <div className="relative overflow-x-auto overflow-y-auto border-2 border-gray-300 rounded-lg shadow-xl max-h-[60vh]">
          <table className="table-auto border-collapse ">
            <thead className="bg-[#640037] text-white sticky top-0">
              <tr>
                {/* Code Header (Sticky Corner) */}
                <th className="p-3 text-left  sticky left-0 bg-[#640037] z-30 shadow-md">
                  Code
                </th>
                {/* Description Header */}
                {!isColumnHidden("Description") && (
                  <th className="p-3 text-left  font-normal">Description</th>
                )}
                {/* Type Header */}
                {!isColumnHidden("Type") && (
                  <th className="p-3 text-center  font-normal">Type</th>
                )}
                {/* Class Header */}
                {!isColumnHidden("Class") && (
                  <th className="p-3 text-center  border-l border-pink-700">
                    Class
                  </th>
                )}
                {/* Total FC Header (Non-Editable) */}
                <th className="p-3 text-right font-extrabold border-l border-pink-700">
                  Total FC
                </th>
                {/* Total AC Header (Mock) */}
                <th className="p-3 text-right  font-extrabold border-l border-pink-700">
                  Total AC (Mock)
                </th>
                {/* Editable Channel Headers */}
                {editableChannels.map((channel) =>
                  !isColumnHidden(channel) ? (
                    <th
                      key={channel}
                      className="p-3 text-right  text-sm font-normal border-l border-pink-700"
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
                  className="border-b border-gray-200 odd:bg-white even:bg-gray-50 hover:bg-pink-100 transition duration-150"
                >
                  {/* Code (Sticky) */}
                  <td className="p-3 text-left font-mono text-sm sticky left-0 bg-white odd:bg-white even:bg-gray-50 hover:bg-pink-100 border-r border-gray-200 z-10 font-bold text-gray-800 ">
                    {item.Code}
                  </td>
                  {/* Description */}
                  {!isColumnHidden("Description") && (
                    <td className="p-3 text-left font-medium text-gray-700">
                      {item.Description}
                    </td>
                  )}
                  {/* Type */}
                  {!isColumnHidden("Type") && (
                    <td className="p-3 text-center text-xs text-gray-500 ">
                      {item.Type}
                    </td>
                  )}
                  {/* Class Selector */}
                  {!isColumnHidden("Class") && (
                    <td className="p-1 text-center border-l border-gray-200 ">
                      <select
                        value={item.Class}
                        onChange={(e) =>
                          handleClassChange(item.Code, e.target.value)
                        }
                        className="p-1  text-center bg-transparent border border-gray-300 rounded focus:ring-pink-500 focus:border-pink-500 text-sm font-bold"
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
                  <td className="p-3 text-right font-normal text-gray-600 border-l border-gray-200 ">
                    {(item.Total * 0.9).toFixed(0).toLocaleString()}
                  </td>
                  {/* Editable Channel Inputs */}
                  {editableChannels.map((channel) =>
                    !isColumnHidden(channel) ? (
                      <td
                        key={channel}
                        className="p-1 text-center border-l border-gray-200 "
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
                          className="w-full p-1 text-right border-b-2 border-pink-300 focus:border-pink-600 focus:ring-0 text-sm font-medium transition duration-100 bg-transparent"
                          style={{ backgroundColor: "transparent" }}
                        />
                      </td>
                    ) : null
                  )}
                </tr>
              ))}
            </tbody>

            {/* --- Table Footer for Totals (ลบออกแล้ว) --- */}
          </table>

          {/* แสดงเมื่อไม่มีข้อมูล */}
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-white text-lg">
              ไม่พบข้อมูลตามเงื่อนไขการค้นหา
            </div>
          )}
        </div>

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
