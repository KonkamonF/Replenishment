// src/AmountAdmin/AcAndFc.jsx
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart, // เพิ่ม PieChart
  Pie, // เพิ่ม Pie
  Cell, // เพิ่ม Cell
} from "recharts";

// --- Mock Data (ข้อมูลรวมที่คุณให้มา) ---
const mockInventoryData = [
  {
    Code: "06-0005-01",
    Class: "B",
    TargetSaleUnit_1: 70,
    SaleOut_มีค68: 43,
    SaleOut_เมย68: 41,
    SaleOut_พค68: 48,
    SaleOut_มิย68: 28,
  },
  {
    Code: "06-0003-01",
    Class: "B",
    TargetSaleUnit_1: 140,
    SaleOut_มีค68: 64,
    SaleOut_เมย68: 70,
    SaleOut_พค68: 71,
    SaleOut_มิย68: 65,
  },
  {
    Code: "06-0003-02",
    Class: "A",
    TargetSaleUnit_1: 120,
    SaleOut_มีค68: 72,
    SaleOut_เมย68: 76,
    SaleOut_พค68: 80,
    SaleOut_มิย68: 78,
  },
  {
    Code: "06-0003-03",
    Class: "C",
    TargetSaleUnit_1: 90,
    SaleOut_มีค68: 38,
    SaleOut_เมย68: 42,
    SaleOut_พค68: 39,
    SaleOut_มิย68: 40,
  },
  {
    Code: "06-0003-04",
    Class: "B",
    TargetSaleUnit_1: 150,
    SaleOut_มีค68: 81,
    SaleOut_เมย68: 79,
    SaleOut_พค68: 85,
    SaleOut_มิย68: 83,
  },
];

const months = ["มีค68", "เมย68", "พค68", "มิย68"];

// Define color palettes
const COLORS_BY_CODE = [
  "#640037",
  "#ff9800",
  "#00bcd4",
  "#4caf50",
  "#ff005c",
  "#8a2be2",
  "#00ced1",
  "#ffc0cb",
  "#7b68ee",
  "#f0e68c",
];
const COLORS_BY_CLASS = {
  A: "#4CAF50", // Green
  B: "#FF9800", // Orange
  C: "#F44336", // Red
  N: "#9E9E9E", // Gray (for 'N' or undefined class)
};

// --- Data Preparation Function 1: Bar Chart Data (Actual vs Target by Month) ---
const getBarChartData = (inventoryData) => {
  const dataByMonth = {};

  inventoryData.forEach((item) => {
    months.forEach((monthKey) => {
      const actualSale = item[`SaleOut_${monthKey}`] || 0;
      const targetSale = item.TargetSaleUnit_1 || 0;

      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = {
          name: monthKey,
          "ยอดขายจริง (หน่วย)": 0,
          "ยอดขายเป้าหมาย (หน่วย)": 0,
        };
      }
      dataByMonth[monthKey]["ยอดขายจริง (หน่วย)"] += actualSale;
      // Target is summed up and then averaged per month for approximation across all items
      dataByMonth[monthKey]["ยอดขายเป้าหมาย (หน่วย)"] +=
        targetSale / months.length;
    });
  });

  return months.map((monthKey) => ({
    ...dataByMonth[monthKey],
    "ยอดขายเป้าหมาย (หน่วย)": Math.round(
      dataByMonth[monthKey]["ยอดขายเป้าหมาย (หน่วย)"]
    ),
  }));
};

// --- Data Preparation Function 2: Pie Chart Data by Product Code (Total Sale Out) ---
const getPieChartDataByCode = (inventoryData) => {
  const pieData = inventoryData.map((item) => {
    const totalSaleOut = months.reduce(
      (sum, monthKey) => sum + (item[`SaleOut_${monthKey}`] || 0),
      0
    );
    return {
      name: `${item.Code} (Class ${item.Class})`,
      value: totalSaleOut,
    };
  });
  return pieData.filter((data) => data.value > 0);
};

// --- Data Preparation Function 3: Pie Chart Data by Class (Total Sale Out) ---
const getPieChartDataByClass = (inventoryData) => {
  const classMap = {};

  inventoryData.forEach((item) => {
    const itemClass = item.Class || "N";
    const totalSaleOut = months.reduce(
      (sum, monthKey) => sum + (item[`SaleOut_${monthKey}`] || 0),
      0
    );

    classMap[itemClass] = (classMap[itemClass] || 0) + totalSaleOut;
  });

  return Object.keys(classMap)
    .sort()
    .map((className) => ({
      name: `Class ${className}`,
      value: classMap[className],
    }))
    .filter((data) => data.value > 0);
};

// Pre-calculate data
const barChartData = getBarChartData(mockInventoryData);
const pieChartDataByCode = getPieChartDataByCode(mockInventoryData);
const pieChartDataByClass = getPieChartDataByClass(mockInventoryData);

// Custom Tooltip content for Pie Charts (can be reused if data structure is similar)
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const chartData = data.name.startsWith("Class")
      ? pieChartDataByClass
      : pieChartDataByCode;
    const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
    const percent = ((data.value / total) * 100).toFixed(2);

    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-md text-xs">
        <p className="font-bold text-[#640037]">{data.name}</p>
        <p>{`ยอดขาย: ${data.value.toLocaleString()} หน่วย`}</p>
        <p>{`สัดส่วน: ${percent}%`}</p>
      </div>
    );
  }
  return null;
};

// Main component AcAndFc
const AcAndFc = () => {
  const [chartType, setChartType] = useState("bar"); // 'bar', 'pie-code', 'pie-class'

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#640037" className="text-xs" />
              <YAxis stroke="#640037" className="text-xs" />
              <Tooltip
                formatter={(value) => value.toLocaleString()}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "12px",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
              <Bar
                dataKey="ยอดขายจริง (หน่วย)"
                fill="#00bcd4" // Cyan/Teal color for Actual
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="ยอดขายเป้าหมาย (หน่วย)"
                fill="#ff9800" // Orange color for Target
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie-code":
        return (
          <div className="h-full flex flex-col items-center justify-center p-2">
            <h4 className="text-center font-bold text-sm text-[#640037] mb-2">
              สัดส่วนยอดขายรวมตามรหัสสินค้า
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Legend
                  iconType="circle"
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: "10px" }}
                />
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={pieChartDataByCode}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {pieChartDataByCode.map((entry, index) => (
                    <Cell
                      key={`code-cell-${index}`}
                      fill={COLORS_BY_CODE[index % COLORS_BY_CODE.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case "pie-class":
        return (
          <div className="h-full flex flex-col items-center justify-center p-2">
            <h4 className="text-center font-bold text-sm text-[#640037] mb-2">
              สัดส่วนยอดขายรวมตาม Class (A, B, C)
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Legend
                  iconType="circle"
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: "10px" }}
                />
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={pieChartDataByClass}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {pieChartDataByClass.map((entry, index) => (
                    <Cell
                      key={`class-cell-${index}`}
                      fill={COLORS_BY_CLASS[entry.name.replace("Class ", "")]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-[450px] w-full flex flex-col">
      {" "}
      {/* กำหนดความสูงให้ AcAndFc */}
      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => setChartType("bar")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer duration-200 ${
            chartType === "bar"
              ? "bg-[#640037] text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          ยอดขายจริง vs เป้าหมาย (รายเดือน)
        </button>
        <button
          onClick={() => setChartType("pie-code")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer duration-200 ${
            chartType === "pie-code"
              ? "bg-[#640037] text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          สัดส่วนยอดขาย (ตามรหัสสินค้า)
        </button>
        <button
          onClick={() => setChartType("pie-class")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer duration-200 ${
            chartType === "pie-class"
              ? "bg-[#640037] text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          สัดส่วนยอดขาย (ตาม Class)
        </button>
      </div>
      <div className="flex-grow">
        {" "}
        {/* ทำให้ส่วนกราฟขยายเต็มพื้นที่ที่เหลือ */}
        {renderChart()}
      </div>
      <p className="text-xs text-gray-500 text-right mt-4 ">
        {chartType === "bar" && "*Target Sale คือค่าประมาณการเฉลี่ยรายเดือน"}
        {(chartType === "pie-code" || chartType === "pie-class") &&
          "*ข้อมูลแสดงสัดส่วนยอดขายรวม (Sale Out) ตั้งแต่ มี.ค.68 ถึง มิ.ย.68"}
      </p>
    </div>
  );
};

export default AcAndFc;
