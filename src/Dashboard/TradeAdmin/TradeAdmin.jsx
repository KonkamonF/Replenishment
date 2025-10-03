import React, { useState } from "react";
// ไม่จำเป็นต้องใช้ AvgSaleOut ในคอมโพเนนต์นี้แล้ว

// --- Mock Data (ข้อมูลใหม่) ---
const mockInventoryData = [
  {
    Code: "06-0005-01",
    Type: "TableTop",
    Class: "B",
    YN_Best_2025: "",
    Brand: "Tecno*",
    Description: "TNS IR 05",
    SubType: "s2il",
    ราคา_กลาง_หน่วย: 1390,
    ราคา_โปรล่าสุด: 1290,
    DayOnHand_DOH: 1413,
    DayOnHand_DOH_Stock2: 376.71,
    TargetSaleUnit_1: 70,
    SaleOutเฉลี่ยวัน: 1.42,
    Stock_จบเหลือจริง: 879,
    SaleOut_มีค68: 43,
    SaleOut_เมย68: 41,
    SaleOut_พค68: 48,
    SaleOut_มิย68: 28,
    Sale_in_Aging_Tier: "Aging1 M",
    สถานะTrade: "Abnormal",
    RemarkTrade: "AC น้อยกว่า FC เกิน 20%",
    DiffPercent: "-90.48%",
    LeadTime: 90,
    ตัดจ่ายเฉลี่ย3เดือน: 6.67,
  },
  {
    Code: "06-0003-01",
    Type: "TableTop",
    Class: "B",
    YN_Best_2025: "Yes",
    Brand: "Tecno*",
    Description: "Table top 1",
    SubType: "s1g1il",
    ราคา_กลาง_หน่วย: 1290,
    ราคา_โปรล่าสุด: 1250,
    DayOnHand_DOH: 310,
    DayOnHand_DOH_Stock2: 148.32,
    TargetSaleUnit_1: 140,
    SaleOutเฉลี่ยวัน: 2.45,
    Stock_จบเหลือจริง: 670,
    SaleOut_มีค68: 64,
    SaleOut_เมย68: 70,
    SaleOut_พค68: 71,
    SaleOut_มิย68: 65,
    Sale_in_Aging_Tier: "No Aging",
    สถานะTrade: "Abnormal",
    RemarkTrade: "AC น้อยกว่า FC เกิน 20%",
    DiffPercent: "-68.12%",
    LeadTime: 80,
    ตัดจ่ายเฉลี่ย3เดือน: 38.2,
  },
  {
    Code: "06-0003-02",
    Type: "TableTop",
    Class: "A",
    YN_Best_2025: "",
    Brand: "Tecno*",
    Description: "Table top 2",
    SubType: "s2g1il",
    ราคา_กลาง_หน่วย: 1450,
    ราคา_โปรล่าสุด: 1390,
    DayOnHand_DOH: 295,
    DayOnHand_DOH_Stock2: 160.44,
    TargetSaleUnit_1: 120,
    SaleOutเฉลี่ยวัน: 2.88,
    Stock_จบเหลือจริง: 710,
    SaleOut_มีค68: 72,
    SaleOut_เมย68: 76,
    SaleOut_พค68: 80,
    SaleOut_มิย68: 78,
    Sale_in_Aging_Tier: "Fresh",
    สถานะTrade: "Normal",
    RemarkTrade: "ยอดขายสอดคล้องกับแผน",
    DiffPercent: "-25.32%",
    LeadTime: 75,
    ตัดจ่ายเฉลี่ย3เดือน: 42.5,
  },
  {
    Code: "06-0003-03",
    Type: "TableTop",
    Class: "C",
    YN_Best_2025: "",
    Brand: "Tecno*",
    Description: "Table top 3",
    SubType: "s3g2il",
    ราคา_กลาง_หน่วย: 1100,
    ราคา_โปรล่าสุด: 990,
    DayOnHand_DOH: 420,
    DayOnHand_DOH_Stock2: 190.12,
    TargetSaleUnit_1: 90,
    SaleOutเฉลี่ยวัน: 1.95,
    Stock_จบเหลือจริง: 560,
    SaleOut_มีค68: 38,
    SaleOut_เมย68: 42,
    SaleOut_พค68: 39,
    SaleOut_มิย68: 40,
    Sale_in_Aging_Tier: "Aging2 M",
    สถานะTrade: "Abnormal",
    RemarkTrade: "สินค้าเคลื่อนไหวน้อย",
    DiffPercent: "-82.67%",
    LeadTime: 95,
    ตัดจ่ายเฉลี่ย3เดือน: 18.6,
  },
  {
    Code: "06-0003-04",
    Type: "TableTop",
    Class: "B",
    YN_Best_2025: "Yes",
    Brand: "Tecno*",
    Description: "Table top 4",
    SubType: "s4g1il",
    ราคา_กลาง_หน่วย: 1350,
    ราคา_โปรล่าสุด: 1320,
    DayOnHand_DOH: 285,
    DayOnHand_DOH_Stock2: 140.56,
    TargetSaleUnit_1: 150,
    SaleOutเฉลี่ยวัน: 3.12,
    Stock_จบเหลือจริง: 695,
    SaleOut_มีค68: 81,
    SaleOut_เมย68: 79,
    SaleOut_พค68: 85,
    SaleOut_มิย68: 83,
    Sale_in_Aging_Tier: "Fresh",
    สถานะTrade: "Normal",
    RemarkTrade: "สินค้าขายดีตามแผน",
    DiffPercent: "-15.24%",
    LeadTime: 70,
    ตัดจ่ายเฉลี่ย3เดือน: 55.4,
  },
  {
    Code: "06-0005-01-A", // เปลี่ยน Code เพื่อให้ key ไม่ซ้ำ
    Type: "TableTop",
    Class: "B",
    YN_Best_2025: "",
    Brand: "Tecno*",
    Description: "TNS IR 05 (Copy)",
    SubType: "s2il",
    ราคา_กลาง_หน่วย: 1390,
    ราคา_โปรล่าสุด: 1290,
    DayOnHand_DOH: 1413,
    DayOnHand_DOH_Stock2: 376.71,
    TargetSaleUnit_1: 70,
    SaleOutเฉลี่ยวัน: 1.42,
    Stock_จบเหลือจริง: 879,
    SaleOut_มีค68: 43,
    SaleOut_เมย68: 41,
    SaleOut_พค68: 48,
    SaleOut_มิย68: 28,
    Sale_in_Aging_Tier: "Aging1 M",
    สถานะTrade: "Abnormal",
    RemarkTrade: "AC น้อยกว่า FC เกิน 20%",
    DiffPercent: "-90.48%",
    LeadTime: 90,
    ตัดจ่ายเฉลี่ย3เดือน: 6.67,
  },
  {
    Code: "06-0003-01-B", // เปลี่ยน Code เพื่อให้ key ไม่ซ้ำ
    Type: "TableTop",
    Class: "B",
    YN_Best_2025: "Yes",
    Brand: "Tecno*",
    Description: "Table top 1 (Copy)",
    SubType: "s1g1il",
    ราคา_กลาง_หน่วย: 1290,
    ราคา_โปรล่าสุด: 1250,
    DayOnHand_DOH: 310,
    DayOnHand_DOH_Stock2: 148.32,
    TargetSaleUnit_1: 140,
    SaleOutเฉลี่ยวัน: 2.45,
    Stock_จบเหลือจริง: 670,
    SaleOut_มีค68: 64,
    SaleOut_เมย68: 70,
    SaleOut_พค68: 71,
    SaleOut_มิย68: 65,
    Sale_in_Aging_Tier: "No Aging",
    สถานะTrade: "Abnormal",
    RemarkTrade: "AC น้อยกว่า FC เกิน 20%",
    DiffPercent: "-68.12%",
    LeadTime: 80,
    ตัดจ่ายเฉลี่ย3เดือน: 38.2,
  },
  {
    Code: "06-0003-02-C", // เปลี่ยน Code เพื่อให้ key ไม่ซ้ำ
    Type: "TableTop",
    Class: "A",
    YN_Best_2025: "",
    Brand: "Tecno*",
    Description: "Table top 2 (Copy)",
    SubType: "s2g1il",
    ราคา_กลาง_หน่วย: 1450,
    ราคา_โปรล่าสุด: 1390,
    DayOnHand_DOH: 295,
    DayOnHand_DOH_Stock2: 160.44,
    TargetSaleUnit_1: 120,
    SaleOutเฉลี่ยวัน: 2.88,
    Stock_จบเหลือจริง: 710,
    SaleOut_มีค68: 72,
    SaleOut_เมย68: 76,
    SaleOut_พค68: 80,
    SaleOut_มิย68: 78,
    Sale_in_Aging_Tier: "Fresh",
    สถานะTrade: "Normal",
    RemarkTrade: "ยอดขายสอดคล้องกับแผน",
    DiffPercent: "-25.32%",
    LeadTime: 75,
    ตัดจ่ายเฉลี่ย3เดือน: 42.5,
  },
  {
    Code: "06-0003-03-D", // เปลี่ยน Code เพื่อให้ key ไม่ซ้ำ
    Type: "TableTop",
    Class: "C",
    YN_Best_2025: "",
    Brand: "Tecno*",
    Description: "Table top 3 (Copy)",
    SubType: "s3g2il",
    ราคา_กลาง_หน่วย: 1100,
    ราคา_โปรล่าสุด: 990,
    DayOnHand_DOH: 420,
    DayOnHand_DOH_Stock2: 190.12,
    TargetSaleUnit_1: 90,
    SaleOutเฉลี่ยวัน: 1.95,
    Stock_จบเหลือจริง: 560,
    SaleOut_มีค68: 38,
    SaleOut_เมย68: 42,
    SaleOut_พค68: 39,
    SaleOut_มิย68: 40,
    Sale_in_Aging_Tier: "Aging2 M",
    สถานะTrade: "Abnormal",
    RemarkTrade: "สินค้าเคลื่อนไหวน้อย",
    DiffPercent: "-82.67%",
    LeadTime: 95,
    ตัดจ่ายเฉลี่ย3เดือน: 18.6,
  },
  {
    Code: "06-0003-04-E", // เปลี่ยน Code เพื่อให้ key ไม่ซ้ำ
    Type: "TableTop",
    Class: "B",
    YN_Best_2025: "Yes",
    Brand: "Tecno*",
    Description: "Table top 4 (Copy)",
    SubType: "s4g1il",
    ราคา_กลาง_หน่วย: 1350,
    ราคา_โปรล่าสุด: 1320,
    DayOnHand_DOH: 285,
    DayOnHand_DOH_Stock2: 140.56,
    TargetSaleUnit_1: 150,
    SaleOutเฉลี่ยวัน: 3.12,
    Stock_จบเหลือจริง: 695,
    SaleOut_มีค68: 81,
    SaleOut_เมย68: 79,
    SaleOut_พค68: 85,
    SaleOut_มิย68: 83,
    Sale_in_Aging_Tier: "Fresh",
    สถานะTrade: "Normal",
    RemarkTrade: "สินค้าขายดีตามแผน",
    DiffPercent: "-15.24%",
    LeadTime: 70,
    ตัดจ่ายเฉลี่ย3เดือน: 55.4,
  },
];

// --- Helper Functions (สำหรับแสดงผล) ---
const formatCurrency = (amount) => {
  return `฿${(amount || 0).toLocaleString()}`;
};

const getDOHStyle = (doh) => {
  if (doh === null || doh === undefined) return "text-gray-500";
  if (doh > 365) return "text-red-600 font-extrabold bg-red-50"; // Stock ล้นเกินปี
  if (doh > 180) return "text-orange-600 font-bold"; // Stock ล้นเกิน 6 เดือน
  return "text-green-600 font-bold"; // ปกติ
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Abnormal":
      return "bg-red-100 text-red-800 border-red-300";
    case "Normal":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// --- Main Component ---
export default function InventoryTradeMonitor() {
  return (
    <div className="p-8 bg-white shadow-2xl rounded-xl">
      {/* --- Header & Summary --- */}
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
          Inventory & Trade Monitor
        </h1>
        <p className="text-gray-500">
          ข้อมูลคงคลัง (Stock) และยอดขาย (Sale Out)
          สำหรับการตัดสินใจสั่งซื้อ/จัดการ Trade
        </p>
      </header>

      {/* --- Key Metrics (Condensed Summary) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-pink-50 p-4 rounded-lg shadow-inner">
          <p className="text-sm text-pink-600 font-semibold">Total SKUs</p>
          <p className="text-2xl font-extrabold text-[#640037]">
            {mockInventoryData.length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
          <p className="text-sm text-blue-600 font-semibold">Total Stock</p>
          <p className="text-2xl font-extrabold">
            {mockInventoryData
              .reduce((sum, item) => sum + (item.Stock_จบเหลือจริง || 0), 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-inner">
          <p className="text-sm text-yellow-600 font-semibold">
            Avg. DOH (Stock)
          </p>
          {/* ใช้ Stock2 ที่เป็นตัวเลขจริง (DOH/SaleOutเฉลี่ย) */}
          <p className="text-2xl font-extrabold">
            {mockInventoryData.length > 0
              ? (
                  mockInventoryData.reduce(
                    (sum, item) => sum + (item.DayOnHand_DOH_Stock2 || 0),
                    0
                  ) / mockInventoryData.length
                )
                  .toFixed(0)
                  .toLocaleString()
              : 0}{" "}
            วัน
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-inner">
          <p className="text-sm text-red-600 font-semibold">Abnormal Count</p>
          <p className="text-2xl font-extrabold">
            {
              mockInventoryData.filter((item) => item.สถานะTrade === "Abnormal")
                .length
            }
          </p>
        </div>
      </div>

      {/* --- Data Table Container (ยกเลิก max-h และ overflow) --- */}
      {/* ใช้ overflow-x-auto แทนการ Scroll ภายใน เพื่อให้ตารางใหญ่พอดีกับข้อมูล แต่ยังมี Scroll แนวนอนหากข้อมูลยาวเกิน */}
      <div className="overflow-x-auto shadow-xl rounded-xl">
        <table className="min-w-full table-auto border-collapse bg-white">
          {/* Table Header (ยกเลิก Sticky Header) */}
          <thead className="bg-[#640037] text-white">
            <tr>
              <th className="p-3 text-left w-[100px] border-r border-pink-700">
                Code/Brand
              </th>
              <th className="p-3 text-left w-[250px] min-w-[250px]">
                Description/Type
              </th>
              <th className="p-3 text-right w-[100px] border-l border-pink-700">
                Price (ล่าสุด)
              </th>
              <th className="p-3 text-right w-[100px]">Stock (เหลือจริง)</th>
              <th className="p-3 text-right w-[100px]">Target Sale</th>
              <th className="p-3 text-right w-[100px]">
                Sale Out (เฉลี่ย/วัน)
              </th>
              <th className="p-3 text-right w-[100px] font-extrabold border-l border-pink-700">
                DOH (วัน)
              </th>
              <th className="p-3 text-center w-[120px]">สถานะ Trade</th>
              <th className="p-3 text-center w-[120px]">Aging Tier</th>
              <th className="p-3 text-left w-[200px]">Remark Trade</th>
            </tr>
          </thead>
          <tbody>
            {mockInventoryData.map((item, index) => (
              <tr
                key={item.Code}
                className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
              >
                {/* Code/Brand (ยกเลิก Sticky Column) */}
                <td className="p-3 text-left font-mono text-sm border-r border-gray-200">
                  <span className="font-bold text-[#640037]">{item.Code}</span>
                  <br />
                  <span className="text-xs text-gray-500">{item.Brand}</span>
                </td>

                {/* Description/Type */}
                <td className="p-3 text-left font-semibold text-gray-700">
                  {item.Description}
                  <span
                    className={`ml-2 text-xs font-normal text-white px-2 py-0.5 rounded-full ${
                      item.Class === "A" ? "bg-orange-500" : "bg-pink-500"
                    }`}
                  >
                    Class {item.Class}
                  </span>
                  <br />
                  <span className="text-xs text-gray-400">
                    {item.Type} ({item.SubType})
                  </span>
                </td>

                {/* Price (ล่าสุด) */}
                <td className="p-3 text-right font-medium border-l border-gray-200">
                  {formatCurrency(item.ราคา_โปรล่าสุด)}
                </td>

                {/* Stock */}
                <td className="p-3 text-right font-bold text-lg">
                  {item.Stock_จบเหลือจริง.toLocaleString()}
                </td>

                {/* Target Sale */}
                <td className="p-3 text-right text-gray-600">
                  {(item.TargetSaleUnit_1 || 0).toLocaleString()}
                </td>

                {/* Sale Out (เฉลี่ย/วัน) */}
                <td className="p-3 text-right text-sm">
                  {(item.SaleOutเฉลี่ยวัน || 0).toFixed(2)}
                </td>

                {/* DOH (วัน) */}
                <td
                  className={`p-3 text-right font-extrabold text-lg border-l border-gray-200 ${getDOHStyle(
                    item.DayOnHand_DOH_Stock2
                  )}`}
                >
                  {(item.DayOnHand_DOH_Stock2 || 0).toFixed(0).toLocaleString()}
                </td>

                {/* สถานะ Trade */}
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(
                      item.สถานะTrade
                    )}`}
                  >
                    {item.สถานะTrade}
                  </span>
                  {item.DiffPercent && (
                    <p
                      className={`text-xs mt-1 font-bold ${
                        item.DiffPercent.startsWith("-")
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {item.DiffPercent}
                    </p>
                  )}
                </td>

                {/* Aging Tier */}
                <td className="p-3 text-center text-sm font-semibold">
                  {item.Sale_in_Aging_Tier || "-"}
                </td>

                {/* Remark Trade */}
                <td className="p-3 text-left text-sm max-w-xs whitespace-normal text-gray-600">
                  {item.RemarkTrade || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        <p>
          💡 **คำอธิบาย DOH (Days On Hand):**
          <span className="text-green-600 font-bold ml-2">
            DOH &lt; 180 วัน
          </span>{" "}
          (ปกติ) |
          <span className="text-orange-600 font-bold ml-2">
            180 &lt; DOH &lt; 365 วัน
          </span>{" "}
          (ควรระวัง) |
          <span className="text-red-600 font-extrabold ml-2">
            DOH &gt; 365 วัน
          </span>{" "}
          (Stock ล้นมาก)
        </p>
        <p className="mt-2">
          **Sale Out เฉลี่ย/วัน:** คำนวณจากยอดตัดจ่ายเฉลี่ย 3 เดือนล่าสุด
          เพื่อความแม่นยำในการคาดการณ์ Stock-Out
        </p>
      </div>
    </div>
  );
}