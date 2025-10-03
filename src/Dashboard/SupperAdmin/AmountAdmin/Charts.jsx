// src/AmountAdmin/AcAndFc.jsx
import React from "react";
import {
  LineChart, // เปลี่ยนจาก BarChart เป็น LineChart
  Line, // ใช้ Line แทน Bar
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
          "ยอดขายจริง (หน่วย)": 0, // เปลี่ยนชื่อคีย์ให้ชัดเจนขึ้น
          "ยอดขายเป้าหมาย (หน่วย)": 0, // เปลี่ยนชื่อคีย์ให้ชัดเจนขึ้น
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
  { Code: "06-0005-01", TargetSaleUnit_1: 70, SaleOut_มีค68: 43, SaleOut_เมย68: 41, SaleOut_พค68: 48, SaleOut_มิย68: 28 },
  { Code: "06-0003-01", TargetSaleUnit_1: 140, SaleOut_มีค68: 64, SaleOut_เมย68: 70, SaleOut_พค68: 71, SaleOut_มิย68: 65 },
  { Code: "06-0003-02", TargetSaleUnit_1: 120, SaleOut_มีค68: 72, SaleOut_เมย68: 76, SaleOut_พค68: 80, SaleOut_มิย68: 78 },
  { Code: "06-0003-03", TargetSaleUnit_1: 90, SaleOut_มีค68: 38, SaleOut_เมย68: 42, SaleOut_พค68: 39, SaleOut_มิย68: 40 },
  { Code: "06-0003-04", TargetSaleUnit_1: 150, SaleOut_มีค68: 81, SaleOut_เมย68: 79, SaleOut_พค68: 85, SaleOut_มิย68: 83 },
];

const chartData = getChartData(mockInventoryData);

const Charts = () => { // เปลี่ยนชื่อคอมโพเนนต์กลับเป็น AcAndFc เพื่อให้สอดคล้องกับไฟล์
  return (
    <div className="h-96 w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">แนวโน้มยอดขายจริงเทียบเป้าหมาย (รายเดือน)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart // เปลี่ยนมาใช้ LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#640037" className="text-xs" />
          <YAxis stroke="#640037" className="text-xs" />
          <Tooltip
            formatter={(value, name) => [value.toLocaleString(), name]} // ปรับ Tooltip ให้แสดงค่าและชื่อ
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "12px",
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
          
          {/* Line สำหรับยอดขายจริง (Actual Sale Out) */}
          <Line
            type="monotone" // ทำให้เส้นโค้งมน
            dataKey="ยอดขายจริง (หน่วย)"
            stroke="#00bcd4" // Cyan/Teal color
            strokeWidth={3}
            dot={{ r: 5 }} // เพิ่มจุดที่ข้อมูล
            activeDot={{ r: 8 }}
          />
          
          {/* Line สำหรับยอดขายเป้าหมาย (Target Sale) */}
          <Line
            type="monotone"
            dataKey="ยอดขายเป้าหมาย (หน่วย)"
            stroke="#ff9800" // Orange color
            strokeWidth={3}
            dot={{ r: 5 }}
            strokeDasharray="5 5" // ทำให้เป็นเส้นประ เพื่อแยกจากยอดขายจริง
          />
          
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 text-right mt-4 ">
        *Target Sale คือค่าประมาณการเฉลี่ยรายเดือน
      </p>
    </div>
  );
};

export default Charts;