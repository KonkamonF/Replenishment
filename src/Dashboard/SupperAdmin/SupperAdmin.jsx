import React from "react";
import ClassA from "./AmountAdmin/ClassA";
import ClassB from "./AmountAdmin/ClassB";
import ClassC from "./AmountAdmin/ClassC";
import ClassN from "./AmountAdmin/ClassN";
import Best from "./AmountAdmin/Best";
import NonMove from "./AmountAdmin/NonMove";
import AcAndFc from "./AmountAdmin/AcAndFc";
import Charts from "./AmountAdmin/Charts";
import Calendar from "./Calendar/Calendar";
import Test2 from "./DetailsAdmin/Test2";

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

        <div className="space-x-4 ">
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-[#640037] cursor-pointer text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:bg-pink-600"
          >
            Import Excel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-pink-800 cursor-pointer text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:bg-pink-600 "
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

          <div className="grid gap-6 text-white sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 ">
            {/* Class Cards */}
            <div className="text-center cursor-pointer p-6 bg-gradient-to-t from-[#ffd9c3] to-yellow-100 text-[#e25e00] rounded-xl shadow-md hover:shadow-xl">
              <ClassA />
            </div>
            <div className="text-center cursor-pointer p-6 bg-gradient-to-b from-[#ffd4f0] to-[#ffb8b8] text-[#b35052] rounded-xl shadow-md hover:shadow-xl">
              <ClassB />
            </div>
            <div className="text-center cursor-pointer p-6 bg-gradient-to-t from-[#c3edff] to-[#d0d7ff] text-[#4531da] rounded-xl shadow-md hover:shadow-xl">
              <ClassC />
            </div>
            <div className="text-center cursor-pointer p-6 bg-gradient-to-b from-[#f2ffc9] to-[#c3ffc9] text-[#0a5511] rounded-xl shadow-md hover:shadow-xl">
              <ClassN />
            </div>

            {/* Other Cards */}
            <div className="text-center cursor-pointer p-6 bg-gradient-to-t from-[#fff8d3] to-[#ffd4b9] text-[#d15000] rounded-xl shadow-md hover:shadow-xl">
              <Best />
            </div>
            <div className="text-center cursor-pointer p-6 bg-gradient-to-b from-[#dcb8ff] to-[#ffccfc] text-[#640D5F] rounded-xl shadow-md hover:shadow-xl">
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

          <div className="bg-white p-6 rounded-xl shadow-2xl border-4  border-[#640037]">
            {/* The chart component itself */}
            <AcAndFc />
            <Charts />

            {/* Button to view the data behind the chart */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleViewChartData}
                className="mt-6 flex items-center cursor-pointer space-x-1 px-3 py-1 text-sm text-[#640037] border border-pink-300 rounded-md hover:bg-pink-50 transition duration-150"
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
        <Calendar />
        <Test2/>
      </div>
    </div>
  );
}
