// src/AmountAdmin/AcAndFc.jsx
import React from "react";
import {
  // LineChart, // ไม่ใช้
  // Line, // ไม่ใช้
  // XAxis, // ไม่ใช้
  // YAxis, // ไม่ใช้
  // CartesianGrid, // ไม่ใช้
  Tooltip,
  Legend,
  ResponsiveContainer,

  // ส่วนประกอบที่จำเป็นสำหรับ RadarChart
  RadarChart, // ใช้ RadarChart
  PolarGrid, // ใช้ PolarGrid แทน CartesianGrid
  PolarAngleAxis, // ใช้ PolarAngleAxis แทน XAxis
  PolarRadiusAxis, // ใช้ PolarRadiusAxis แทน YAxis
  Radar, // ใช้ Radar แทน Line
} from "recharts";

// --- Data Preparation Function (ใช้ฟังก์ชันเดิม) ---
const getChartData = (inventoryData) => {
  const dataByMonth = {};
  const months = ["มีค68", "เมย68", "พค68", "มิย68"];

  // 1. Calculate Total SaleOut and Target for each month
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
      // Target is a single target, so we need to sum it up across all items
      dataByMonth[monthKey]["ยอดขายเป้าหมาย (หน่วย)"] +=
        targetSale / months.length; // Approximate monthly target
    });
  });

  // 2. Convert object to array and round the target
  return months.map((monthKey) => ({
    ...dataByMonth[monthKey],
    "ยอดขายเป้าหมาย (หน่วย)": Math.round(
      dataByMonth[monthKey]["ยอดขายเป้าหมาย (หน่วย)"]
    ),
  }));
};

// --- Mock Data (ข้อมูลรวมที่คุณให้มา) ---
const mockInventoryData = [
  {
    Code: "06-0005-01",
    TargetSaleUnit_1: 70,
    SaleOut_มีค68: 43,
    SaleOut_เมย68: 41,
    SaleOut_พค68: 48,
    SaleOut_มิย68: 28,
  },
  {
    Code: "06-0003-01",
    TargetSaleUnit_1: 140,
    SaleOut_มีค68: 64,
    SaleOut_เมย68: 70,
    SaleOut_พค68: 71,
    SaleOut_มิย68: 65,
  },
  {
    Code: "06-0003-02",
    TargetSaleUnit_1: 120,
    SaleOut_มีค68: 72,
    SaleOut_เมย68: 76,
    SaleOut_พค68: 80,
    SaleOut_มิย68: 78,
  },
  {
    Code: "06-0003-03",
    TargetSaleUnit_1: 190,
    SaleOut_มีค68: 38,
    SaleOut_เมย68: 42,
    SaleOut_พค68: 39,
    SaleOut_มิย68: 40,
  },
  {
    Code: "06-0003-04",
    TargetSaleUnit_1: 150,
    SaleOut_มีค68: 81,
    SaleOut_เมย68: 179,
    SaleOut_พค68: 85,
    SaleOut_มิย68: 50,
  },
];

const chartData = getChartData(mockInventoryData);

// เปลี่ยนชื่อคอมโพเนนต์กลับเป็น AcAndFc เพื่อให้สอดคล้องกับไฟล์
const Charts = () => {
  // หาค่าสูงสุดสำหรับ PolarRadiusAxis เพื่อให้กราฟดูสมมาตร
  const maxActual = Math.max(...chartData.map((d) => d["ยอดขายจริง (หน่วย)"]));
  const maxTarget = Math.max(
    ...chartData.map((d) => d["ยอดขายเป้าหมาย (หน่วย)"])
  );
  const maxDomain = Math.ceil(Math.max(maxActual, maxTarget) / 10) * 10; // ปัดขึ้นเป็นหลักสิบ

  return (
    <div className="h-96 w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        แนวโน้มยอดขายจริงเทียบเป้าหมาย (รายเดือน)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          {/* ใช้ PolarGrid แทน CartesianGrid */}
          <PolarGrid stroke="#f0f0f0" />

          {/* ใช้ PolarAngleAxis แทน XAxis (แสดงเดือน) */}
          <PolarAngleAxis dataKey="name" stroke="#640037" className="text-xs" />

          {/* ใช้ PolarRadiusAxis แทน YAxis (แสดงหน่วย) */}
          {/* กำหนด domain เพื่อให้วงกลมแสดงค่าตามจริงและขยายเพื่อแสดงข้อมูลทั้งหมด */}
          <PolarRadiusAxis
            domain={[0, maxDomain]}
            angle={90} // ตำแหน่งแสดงตัวเลข
            stroke="#640037"
            className="text-xs"
          />

          <Tooltip
            formatter={(value, name) => [value.toLocaleString(), name]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "12px",
            }}
          />

          <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />

          {/* ใช้ Radar แทน Line สำหรับยอดขายจริง (Actual Sale Out) */}
          <Radar
            name="ยอดขายจริง (หน่วย)" // ต้องใส่ name สำหรับแสดงใน Tooltip/Legend
            dataKey="ยอดขายจริง (หน่วย)"
            stroke="#00bcd4" // Cyan/Teal color
            fill="#00bcd4" // เติมสี
            fillOpacity={0.3} // ความทึบ
            strokeWidth={3}
          />

          {/* ใช้ Radar แทน Line สำหรับยอดขายเป้าหมาย (Target Sale) */}
          <Radar
            name="ยอดขายเป้าหมาย (หน่วย)" // ต้องใส่ name สำหรับแสดงใน Tooltip/Legend
            dataKey="ยอดขายเป้าหมาย (หน่วย)"
            stroke="#ff9800" // Orange color
            fill="#ff9800"
            fillOpacity={0.3}
            strokeWidth={3}
            // ใน RadarChart ไม่มีการใช้ strokeDasharray เหมือน LineChart
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 text-start mt-4 ">
        *Target Sale คือค่าประมาณการเฉลี่ยรายเดือน
      </p>
    </div>
  );
};

export default Charts;
