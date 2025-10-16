import React from "react";
// Import Components ที่เป็น Placeholder
import ClassA from "./AmountAdmin/ClassA";
import ClassB from "./AmountAdmin/ClassB";
import ClassC from "./AmountAdmin/ClassC";
import ClassN from "./AmountAdmin/ClassN";
import Best from "./AmountAdmin/Best";
import NonMove from "./AmountAdmin/NonMove";
// Import Component กราฟ
import AcAndFc from "./AmountAdmin/AcAndFc";
import Charts from "./AmountAdmin/Charts";

export default function SuperAdmin() {
  // Functions to handle button clicks (you'll implement the actual logic here)
  const handleImport = () => {
    alert("Functionality to import Excel will go here!");
    // Logic for importing Excel file
  };

  const handleExport = () => {
    alert("Functionality to export to Excel will go here!");
    // Logic for exporting data to Excel file
  };

  // New function for viewing chart data
  const handleViewChartData = () => {
    // ในการใช้งานจริง จะเปิด Modal แสดงตารางข้อมูลดิบของกราฟ
    alert(
      "Functionality to show the underlying chart data (e.g., in a table or modal) will go here! (Show Data Table)"
    );
    // Logic to display the chart's data
  };

  return (
    // Main container, using 'min-h-screen' for full height and a light background
    <div className="h-full bg-white rounded-xl p-6 ">
      {/* --- Header Section (Unchanged) --- */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-pink-200">
        <h1 className="text-3xl font-extrabold text-[#640037]">
          Super Admin Dashboard
        </h1>
        <div className="space-x-4">
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-[#640037] text-white font-semibold rounded-lg shadow-md hover:bg-pink-800 transition duration-300 ease-in-out"
          >
            Import Excel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition duration-300 ease-in-out"
          >
            Export Excel
          </button>
        </div>
      </header>

      {/* --- Main Content Layout (Unchanged) --- */}
      <div className="flex flex-col gap-8">
        {/* --- Left Column: Summary Cards (Unchanged) --- */}
        <div className="text-[#640037]">
          <h2 className="text-2xl font-bold mb-6 text-[#640037]">
            Summary Metrics
          </h2>

          <div className="grid grid-cols-6 gap-6">
            {/* Class Cards */}
            <div className="">
              <ClassA />
            </div>
            <div className="">
              <ClassB />
            </div>
            <div className="">
              <ClassC />
            </div>
            <div className="">
              <ClassN />
            </div>

            {/* Other Cards */}
            <div className="">
              <Best />
            </div>
            <div className="">
              <NonMove />
            </div>
          </div>
        </div>
        <hr />
        {/* --- Right Column: Primary Component (AcAndFc) - FOCUS OF CHANGE --- */}
        <div className="">
          <h2 className="text-2xl font-bold mb-6 text-[#640037]">
            Analysis & Forecast (Interactive Charts)
          </h2>

          <div className="bg-white p-6 rounded-xl shadow-2xl border-4 border-[#640037]">
            {/* The chart component itself */}
            <AcAndFc />
            <Charts />

            {/* Button to view the data behind the chart */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleViewChartData}
                className="mt-6 flex items-center space-x-1 px-3 py-1 text-sm text-[#640037] border border-pink-300 rounded-md hover:bg-pink-50 transition duration-150"
                aria-label="View underlying chart data"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                <span>View Data Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
