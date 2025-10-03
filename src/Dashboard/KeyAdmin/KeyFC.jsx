import React, { useState, useMemo } from "react";

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

const availableClasses = ["A", "B", "C", "MD", "N"];

// Helper function คำนวณยอดรวมใหม่
const calculateTotal = (item) => {
  return editableChannels.reduce(
    (sum, channel) => sum + (parseInt(item[channel]) || 0),
    0
  );
};

export default function KeyFC() {
  const [data, setData] = useState(initialKeyFCData);
  const [isDataChanged, setIsDataChanged] = useState(false);

  // --- NEW: คำนวณยอดรวมทั้งหมด (Grand Totals) ---
  const grandTotals = useMemo(() => {
    const totals = { Total: 0 };
    editableChannels.forEach((channel) => (totals[channel] = 0));

    data.forEach((item) => {
      totals.Total += item.Total;
      editableChannels.forEach((channel) => {
        totals[channel] += parseInt(item[channel]) || 0;
      });
    });
    return totals;
  }, [data]);
  // ----------------------------------------------

  // Function จัดการการเปลี่ยนแปลงค่าในช่อง Input
  const handleValueChange = (code, channel, value) => {
    setIsDataChanged(true);

    const newData = data.map((item) => {
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

  // Function สำหรับการยืนยันการเปลี่ยนแปลง (Submit) (เหมือนเดิม)
  const handleSubmit = () => {
    if (!isDataChanged) {
      alert("ไม่พบการเปลี่ยนแปลงข้อมูล กรุณาแก้ไขข้อมูลก่อนบันทึก.");
      return;
    }

    // ... API Call Logic ...
    console.log("Submitting the following forecast data:", data);
    alert(
      `✅ ยืนยันการเปลี่ยนแปลงข้อมูล Forecast จำนวน ${data.length} รายการสำเร็จ! (ข้อมูลถูกส่งไปที่ Console)`
    );

    setIsDataChanged(false);
  };

  return (
    <div className="p-6 bg-white shadow-2xl rounded-xl">
      {/* --- Header with Save Button --- */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-3xl font-extrabold text-[#640037]">
          Key Product Forecast (FC)
        </h1>
        <button
          onClick={handleSubmit}
          disabled={!isDataChanged}
          className={`px-5 py-2 rounded-lg font-semibold transition duration-300 shadow-md
                        ${
                          isDataChanged
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
        >
          {isDataChanged ? "💾 Save Forecast" : "No Changes"}
        </button>
      </div>

      <p className="text-gray-500 mb-4">
        ปรับปรุงยอดพยากรณ์การขายแยกตามช่องทางจำหน่าย (Channels) และแก้ไข Class
        สินค้า
      </p>

      {/* --- Data Table --- */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-[#640037] text-white sticky top-0">
            {/* Table Header (คงเดิม) */}
            <tr>
              <th className="p-3 text-left w-[120px] sticky left-0 bg-[#640037] z-20">
                Code
              </th>
              <th className="p-3 text-left w-[250px]">Description</th>
              <th className="p-3 text-center w-[80px]">Type</th>
              <th className="p-3 text-center w-[100px] border-l border-pink-700">
                Class
              </th>
              <th className="p-3 text-right w-[120px] font-extrabold border-l border-pink-700">
                Total FC
              </th>
              {editableChannels.map((channel) => (
                <th
                  key={channel}
                  className="p-3 text-right w-[100px] text-xs font-normal border-l border-pink-700 whitespace-nowrap"
                >
                  {channel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Table Body (คงเดิม) */}
            {data.map((item) => (
              <tr
                key={item.Code}
                className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
              >
                {/* Code (Sticky) */}
                <td className="p-3 text-left font-mono text-sm sticky left-0 bg-white hover:bg-pink-50 border-r border-gray-200 z-10">
                  {item.Code}
                </td>

                <td className="p-3 text-left font-semibold text-gray-700">
                  {item.Description}
                </td>
                <td className="p-3 text-center text-xs text-gray-500">
                  {item.Type}
                </td>

                {/* Class Selector */}
                <td className="p-1 text-center border-l border-gray-200">
                  <select
                    value={item.Class}
                    onChange={(e) =>
                      handleClassChange(item.Code, e.target.value)
                    }
                    className="p-1 w-full text-center bg-transparent border border-gray-300 rounded focus:ring-pink-500 focus:border-pink-500 text-sm font-bold"
                  >
                    {availableClasses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Total FC */}
                <td className="p-3 text-right font-extrabold text-lg text-red-600 border-l border-gray-200">
                  {item.Total.toLocaleString()}
                </td>

                {/* Editable Channel Inputs */}
                {editableChannels.map((channel) => (
                  <td
                    key={channel}
                    className="p-1 text-center border-l border-gray-200"
                  >
                    <input
                      type="number"
                      min="0"
                      value={item[channel]}
                      onChange={(e) =>
                        handleValueChange(item.Code, channel, e.target.value)
                      }
                      className="w-full p-1 text-right border-b border-pink-300 focus:border-pink-600 focus:ring-0 text-sm font-medium transition duration-100"
                      style={{ backgroundColor: "transparent" }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          {/* --- NEW: Table Footer for Totals --- */}
          <tfoot className="bg-pink-100 border-t-4 border-[#640037] sticky bottom-0">
            <tr>
              <th
                colSpan="4"
                className="p-3 text-right font-extrabold text-lg text-[#640037] sticky left-0 bg-pink-100 z-20"
              >
                GRAND TOTAL:
              </th>

              {/* Grand Total FC */}
              <th className="p-3 text-right font-extrabold text-xl text-red-800 border-l border-[#640037]">
                {grandTotals.Total.toLocaleString()}
              </th>

              {/* Grand Totals by Channel */}
              {editableChannels.map((channel) => (
                <th
                  key={`total-${channel}`}
                  className="p-3 text-right font-bold text-sm text-gray-800 border-l border-[#640037] whitespace-nowrap"
                >
                  {grandTotals[channel].toLocaleString()}
                </th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ... Information Box (คงเดิม) ... */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        <p>
          ⚠️ **หมายเหตุ:** ข้อมูล **Total FC**
          จะถูกคำนวณอัตโนมัติจากผลรวมของยอดขายตามช่องทางจำหน่ายที่ท่านกรอก
        </p>
        <p>
          💡 **สถานะปุ่ม:** ปุ่ม **Save Forecast**
          จะเปิดใช้งานเมื่อมีการแก้ไขข้อมูลในตารางเท่านั้น
        </p>
      </div>
    </div>
  );
}
