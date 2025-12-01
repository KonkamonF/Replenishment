import React, { useState } from "react";
// สมมติว่ามีการนำเข้าจากไลบรารี recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ⚠️ ต้องกำหนดค่าตัวแปรเหล่านี้เอง
const COLORS_BY_CODE = ["#FF5733", "#33FF57", "#3357FF"];
const totalValue = 1000;
const pieDataDefault = [
  { name: "ยอดขายจริง", value: 750 },
  { name: "ยอดเป้าหมายที่เหลือ", value: 250 },
];
const CustomPieTooltip = ({ total }) => {
  /* โค้ดสำหรับ Tooltip ที่กำหนดเอง */
  return null;
};
// ------------------------------------

const SalesChartWithMonthSelector = () => {
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");

  const months = [
    { value: "01", label: "มกราคม" },
    { value: "02", label: "กุมภาพันธ์" },
    { value: "03", label: "มีนาคม" },
    { value: "04", label: "เมษายน" },
    { value: "05", label: "พฤษภาคม" },
    { value: "06", label: "มิถุนายน" },
    { value: "07", label: "กรกฎาคม" },
    { value: "08", label: "สิงหาคม" },
    { value: "09", label: "กันยายน" },
    { value: "10", label: "ตุลาคม" },
    { value: "11", label: "พฤศจิกายน" },
    { value: "12", label: "ธันวาคม" },
  ];

  // ฟังก์ชันสำหรับสร้าง Select Element (นำมาจากคำตอบที่แล้ว)
  const renderMonthSelect = (value, setValue, label) => (
    <div className="flex flex-col items-start">
      {/* Label เหนือ Dropdown */}
      <label className="text-xs text-gray-500 mb-1">{label}</label>
      
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="cursor-pointer px-3 py-1 text-sm text-[#640037] border border-pink-300 rounded-md hover:bg-pink-50 transition duration-150 appearance-none bg-white pr-6"
        aria-label={`Select ${label} month`}
      >
        <option value="" disabled>-- เลือกเดือน --</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
    </div>
  );
  
  // ฟังก์ชันสำหรับแสดงผลช่วงเดือนที่เลือก
  const formatMonthRange = () => {
    const startLabel = startMonth ? months.find(m => m.value === startMonth).label : '...';
    const endLabel = endMonth ? months.find(m => m.value === endMonth).label : '...';
    
    if (!startMonth && !endMonth) return "";
    
    return `ช่วงเดือนที่เลือก: ${startLabel} ${startMonth && endMonth ? ' ถึง ' : ''} ${endLabel}`;
  };

  return (
    // คอนเทนเนอร์หลัก
    <div className="h-full flex flex-col items-center justify-center p-2">
      {/* 1. ส่วนหัวข้อ */}
      <h4 className="text-center font-bold text-sm text-[#640037] mb-4">
        สัดส่วนยอดขายจริงต่อยอดเป้าหมาย
      </h4>

      {/* 2. ส่วนควบคุม (Dropdowns) */}
      <div className="flex justify-center space-x-4 mb-4">
        {renderMonthSelect(startMonth, setStartMonth, "เดือนเริ่มต้น")}
        {renderMonthSelect(endMonth, setEndMonth, "เดือนสิ้นสุด")}
      </div>
      
      {/* 3. แสดงผลช่วงเดือนที่เลือก */}
      <p className="text-xs text-gray-500 mb-4">
        {formatMonthRange()}
      </p>

      {/* 4. ส่วนแผนภูมิ (Pie Chart) */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: "10px" }}
          />
          <Tooltip content={<CustomPieTooltip total={totalValue} />} />
          <Pie
            data={pieDataDefault}
            dataKey="value"
            nameKey="name"
            cx="40%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
          >
            {pieDataDefault.map((entry, index) => (
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
};

export default SalesChartWithMonthSelector;