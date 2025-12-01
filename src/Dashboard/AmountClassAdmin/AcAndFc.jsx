// src/AmountAdmin/AcAndFc.jsx
import React, { useState, useMemo } from "react";
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
import { useMonthlySalesSummary } from "../../hooks/useMonthlySalesSummary";
import { useProductTotalByClass } from "../../hooks/useProductTotalByClass";

// ... (COLORS_BY_CODE, COLORS_BY_CLASS, CustomPieTooltip) โค้ดเดิม

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
  A: "#FF6384",
  B: "#36A2EB",
  C: "#FFCE56",
  D: "#4BC0C0",
  E: "#9966FF",
  MD: "#FF9F40",
  N: "#9E9E9E",
  "": "#CCCCCC", // ไม่มีค่า class
};

// Tooltip สำหรับ PieChart
const CustomPieTooltip = ({ active, payload, total, unitType }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const percent = total ? ((value / total) * 100).toFixed(2) : 0;
    const unitLabel = unitType === "Units" ? "รายการ" : "บาท"; // กำหนดหน่วยที่แสดงผล

    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-md text-xs">
        <p className="font-bold text-[#640037]">{name}</p>
        <p>{`${
          unitType === "Units" ? "จำนวนสินค้า" : "มูลค่า"
        }: ${value.toLocaleString()} ${unitLabel}`}</p>
        <p>{`สัดส่วน: ${percent}%`}</p>
      </div>
    );
  }
  return null;
};
// ----------------------------------------------------

const AcAndFc = ({ classSummaryData }) => {
  // 1. Hook สำหรับดึงข้อมูล
  const { data, loading, error } = useMonthlySalesSummary();
  const [chartType, setChartType] = useState("bar");

  // 2. State สำหรับเลือกเดือน, Set/Non-Set, และ Units/Amounts
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [setFilter, setSetFilter] = useState("all");
  // 🔑 เพิ่ม State ใหม่สำหรับ Units/Amounts
  const [unitType, setUnitType] = useState("Units"); // Default เป็น Units

  // ข้อมูลเดือน (ภาษาไทย)
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

  // ฟังก์ชันสำหรับสร้าง Select Element (Dropdown เลือกเดือน)
  const renderMonthSelect = (value, setValue, label) => (
    <div className="flex flex-col items-start">
      <label className="text-xs text-gray-500 mb-1">{label}</label>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="cursor-pointer px-3 py-1 text-sm text-[#640037] border border-pink-300 rounded-md hover:bg-pink-50 transition duration-150 appearance-none bg-white pr-6"
        aria-label={`Select ${label} month`}
      >
        <option value="">-- ทั้งหมด --</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
    </div>
  );

  // ฟังก์ชันสำหรับสร้าง Select Element (Dropdown เลือก Set/Non-Set)
  const renderSetSelect = (value, setValue) => (
    <div className="flex flex-col items-start">
      <label className="text-xs text-gray-500 mb-1">ประเภทสินค้า</label>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="cursor-pointer px-3 py-1 text-sm text-[#640037] border border-pink-300 rounded-md hover:bg-pink-50 transition duration-150 appearance-none bg-white pr-6"
        aria-label="Select Set/Non-Set filter"
      >
        <option value="all">สินค้าทั้งหมด</option>
        <option value="nonset">สินค้าเดี่ยว</option>
        <option value="set">สินค้าชุดเซ็ต</option>
      </select>
    </div>
  );

  // 🔑 ฟังก์ชันใหม่สำหรับสร้าง Select Element (Dropdown เลือก Units/Amounts)
  const renderUnitSelect = (value, setValue) => (
    <div className="flex flex-col items-start">
      <label className="text-xs text-gray-500 mb-1">แสดงผลด้วย</label>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="cursor-pointer px-3 py-1 text-sm text-[#640037] border border-pink-300 rounded-md hover:bg-pink-50 transition duration-150 appearance-none bg-white pr-6"
        aria-label="Select Units or Amounts"
      >
        <option value="Units">จำนวนหน่วย (Units)</option>
        <option value="Amounts">มูลค่า (Amounts)</option>
      </select>
    </div>
  );

  // ฟังก์ชันสำหรับแสดงผลช่วงเดือนที่เลือก
  const formatMonthRange = () => {
    const startLabel = startMonth
      ? months.find((m) => m.value === startMonth).label
      : "...";
    const endLabel = endMonth
      ? months.find((m) => m.value === endMonth).label
      : "...";

    const setLabel =
      setFilter === "all" ? "ทั้งหมด" : setFilter === "set" ? "Set" : "Non-Set";
    const unitLabel = unitType === "Units" ? "หน่วย" : "มูลค่า";

    let rangeText = `ช่วงเดือน: ${startLabel} ${
      startMonth && endMonth ? " ถึง " : ""
    } ${endLabel}`;

    // จัดรูปแบบข้อความแสดงผล
    if (!startMonth && !endMonth) {
      rangeText = "ยังไม่ได้เลือกช่วงเดือน";
    }

    return `${rangeText} | สินค้า: ${setLabel} | แสดงผล: ${unitLabel}`;
  };

  // 🔑 3. ฟังก์ชันกรองข้อมูลหลักตามช่วงเดือนและ Set/Non-Set (โค้ดเดิม)
  const filterDataByMonthRangeAndSet = (data) => {
    let currentData = data;

    // 3.1. กรองตามเดือน
    if (startMonth && endMonth) {
      const startNum = parseInt(startMonth);
      const endNum = parseInt(endMonth);

      currentData = currentData.filter((d) => {
        const monthPart = d.name.split("-")[1];
        const currentMonthNum = parseInt(monthPart);
        return currentMonthNum >= startNum && currentMonthNum <= endNum;
      });
    }

    // 3.2. กรองตาม Set/Non-Set
    if (setFilter === "all") {
      return currentData;
    }

    const isSet = (itemCode) =>
      itemCode && (itemCode.startsWith("14") || itemCode.startsWith("15"));

    return currentData.filter((d) => {
      const itemCode = d.ItemCode; // สมมติว่ามี ItemCode อยู่ในข้อมูล
      if (setFilter === "set") {
        return isSet(itemCode);
      }
      if (setFilter === "nonset") {
        return !isSet(itemCode);
      }
      return true;
    });
  };

  // 🔑 4. ข้อมูลที่ถูกกรองแล้ว
  const filteredData = useMemo(() => {
    return filterDataByMonthRangeAndSet(data);
  }, [data, startMonth, endMonth, setFilter]); // ต้องเพิ่ม setFilter เป็น dependency

  // ส่วนอื่นๆ
  const {
    totals,
    loading: loadingClass,
    error: errorClass,
  } = useProductTotalByClass({
    classType: "manual",
  });

  // ... (ส่วนการจัดการโหลด/ข้อผิดพลาด/โค้ดเดิม)
  if (loading)
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
    );
  if (error)
    return (
      <div className="h-96 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  if (!data.length)
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
        ไม่มีข้อมูล
      </div>
    );

  // 🔑 กำหนด DataKey ที่จะใช้ตาม UnitType ที่เลือก
  const dataKeyActual =
    unitType === "Units" ? "ยอดขายจริง (หน่วย)" : "ยอดขายจริง (มูลค่า)";
  const dataKeyTarget =
    unitType === "Units" ? "ยอดขายเป้าหมาย (หน่วย)" : "ยอดขายเป้าหมาย (มูลค่า)";
  const unitLabelForChart = unitType === "Units" ? "หน่วย" : "มูลค่า";

  // คำนวณผลรวมจากข้อมูลที่กรองแล้ว
  const totalActual = filteredData.reduce(
    (sum, d) => sum + (d[dataKeyActual] || 0),
    0
  );
  const totalTarget = filteredData.reduce(
    (sum, d) => sum + (d[dataKeyTarget] || 0),
    0
  );

  const pieDataDefault = [
    { name: dataKeyActual, value: totalActual },
    { name: dataKeyTarget, value: totalTarget },
  ];

  // ฟังก์ชันแสดงกราฟ
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                stroke="#640037"
                className="text-xs"
                tickFormatter={(v) => v.replace("2025-", "")}
              />
              <YAxis
                stroke="#640037"
                className="text-xs"
                // แสดงหน่วยบนแกน Y
                label={{
                  value: unitLabelForChart,
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                  fill: "#640037",
                  fontSize: 10,
                }}
              />
              <Tooltip
                formatter={(v) => v.toLocaleString() + " " + unitLabelForChart}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
              <Bar
                dataKey={dataKeyActual} // ใช้ DataKey ที่เลือก
                name="ยอดขายจริง"
                fill="#00bcd4"
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={dataKeyTarget} // ใช้ DataKey ที่เลือก
                name="ยอดขายเป้าหมาย"
                fill="#ff9800"
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie-code":
        const totalValue = totalActual + totalTarget;

        return (
          <div className="h-full flex flex-col items-center justify-center p-2">
            <h4 className="text-center font-bold text-sm text-[#640037] mb-2">
              {/* เปลี่ยนหัวข้อตาม UnitType */}
              สัดส่วน{unitType === "Units" ? "จำนวนหน่วย" : "มูลค่า"}
              ยอดขายจริงต่อยอดเป้าหมาย
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
                <Tooltip
                  content={
                    <CustomPieTooltip total={totalValue} unitType={unitType} />
                  }
                />
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

      case "pie-class":
        // ⚠️ กราฟนี้ยังต้องใช้การปรับ Hook useProductTotalByClass เพื่อให้รองรับการกรอง Units/Amounts
        // โค้ดด้านล่างยังคงใช้ข้อมูล totals ดิบ
        if (loadingClass || errorClass) return null;

        const allowedClasses = ["A", "B", "C", "D", "MD", "N"];
        const pieData = Object.entries(totals || {})
          .filter(([key]) => allowedClasses.includes(key))
          .map(([key, value]) => ({
            name: `Class ${key}`,
            value,
          }));

        if (!pieData.length)
          return (
            <div className="h-96 flex items-center justify-center text-gray-400">
              ไม่มีข้อมูล Class
            </div>
          );

        return (
          <div className="h-full flex flex-col items-center justify-center p-2">
            <h4 className="text-center font-bold text-sm text-[#640037] mb-2">
              สัดส่วนสินค้าตาม Class (A, B, C, …)
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
                <Tooltip
                  content={
                    <CustomPieTooltip
                      total={pieData.reduce((a, b) => a + b.value, 0)}
                      unitType={unitType} // ส่ง unitType เข้าไปเพื่อแสดงผลใน Tooltip
                    />
                  }
                />
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
                          entry.name.replace("Class ", "") || ""
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
    <div className="h-[500px] w-full flex flex-col ">
      {/* ส่วนควบคุม: ปุ่มสลับกราฟ + Dropdown เลือกเดือน + Dropdown Set/Non-Set + Dropdown Units/Amounts */}
      <div className="flex justify-between items-center mb-4 px-2">
        {/* กลุ่มปุ่มสลับกราฟ (อยู่ซ้าย) */}
        <div className="flex space-x-2">
          {/* ... (ปุ่มสลับกราฟ 3 ปุ่ม) โค้ดเดิม */}
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
            สัดส่วนยอดขายจริงต่อยอดเป้าหมาย
          </button>
          <button
            onClick={() => setChartType("pie-class")}
            className={`px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer duration-200 ${
              chartType === "pie-class"
                ? "bg-[#640037] text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            สัดส่วนสินค้า (ตาม Class)
          </button>
        </div>

        {/* กลุ่ม Dropdown เลือกเดือน, Set/Non-Set, และ Units/Amounts (อยู่ขวา) */}
        <div className="flex items-end space-x-3">
          {/* 🔑 Dropdown Units/Amounts ใหม่ */}
          {renderUnitSelect(unitType, setUnitType)}

          {/* Dropdown Set/Non-Set */}
          {renderSetSelect(setFilter, setSetFilter)}

          {/* Dropdown เลือกเดือน */}
          {renderMonthSelect(startMonth, setStartMonth, "เดือนเริ่มต้น")}
          {renderMonthSelect(endMonth, setEndMonth, "เดือนสิ้นสุด")}
        </div>
      </div>

      {/* 5. แสดงผลช่วงเดือนที่เลือก */}
      <div className="text-right text-xs text-gray-500 mb-2 mr-2">
        {formatMonthRange()}
      </div>

      {/* 6. ส่วนแสดงกราฟ */}
      <div className="flex-grow">{renderChart()}</div>
    </div>
  );
};

export default AcAndFc;
