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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useMonthlySalesSummary } from "../hooks/useMonthlySalesSummary";

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
  A: "#4CAF50",
  B: "#FF9800",
  C: "#F44336",
  N: "#9E9E9E",
};

// Tooltip
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const total = payload.reduce((sum, d) => sum + d.value, 0);
    const percent = ((value / total) * 100).toFixed(2);
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-md text-xs">
        <p className="font-bold text-[#640037]">{name}</p>
        <p>{`ยอดขาย: ${value.toLocaleString()} หน่วย`}</p>
        <p>{`สัดส่วน: ${percent}%`}</p>
      </div>
    );
  }
  return null;
};

const AcAndFc = () => {
  const { data, loading, error } = useMonthlySalesSummary();
  const [chartType, setChartType] = useState("bar");

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
    );
  if (error)
    return (
      <div className="h-96 flex items-center justify-center text-red-600">
        ❌ {error}
      </div>
    );
  if (!data.length)
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
        ไม่มีข้อมูลยอดขาย
      </div>
    );

  // ข้อมูลจาก API
  const totalActual = data.reduce(
    (sum, d) => sum + (d["ยอดขายจริง (หน่วย)"] || 0),
    0
  );
  const totalTarget = data.reduce(
    (sum, d) => sum + (d["ยอดขายเป้าหมาย (หน่วย)"] || 0),
    0
  );

  const pieData = [
    { name: "ยอดขายจริง (หน่วย)", value: totalActual },
    { name: "ยอดขายเป้าหมาย (หน่วย)", value: totalTarget },
  ];

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                stroke="#640037"
                className="text-xs"
                tickFormatter={(v) => v.replace("2025-", "")}
              />
              <YAxis stroke="#640037" className="text-xs" />
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: "10px" }}
              />
              <Bar
                dataKey="ยอดขายจริง (หน่วย)"
                fill="#00bcd4"
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="ยอดขายเป้าหมาย (หน่วย)"
                fill="#ff9800"
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
              <PieChart>
                <Legend
                  iconType="circle"
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: "10px" }}
                />
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`pie-cell-${index}`}
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
              <PieChart>
                <Legend
                  iconType="circle"
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: "10px" }}
                />
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`class-cell-${index}`}
                      fill={
                        COLORS_BY_CLASS[
                          entry.name.replace("Class ", "")
                        ] || "#9E9E9E"
                      }
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

      <div className="flex-grow">{renderChart()}</div>

      <p className="text-xs text-gray-500 text-right mt-4">
        {chartType === "bar"
          ? "*Target Sale คือค่าประมาณการเฉลี่ยรายเดือน"
          : "*ข้อมูลแสดงสัดส่วนยอดขายรวม (Sale Out)"}
      </p>
    </div>
  );
};

export default AcAndFc;
