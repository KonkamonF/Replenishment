import React, { useState, useMemo } from "react";

// --- Mock Data (ข้อมูลใหม่ พร้อม KeyRemarks) ---
const initialInventoryData = [
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
    KeyRemarks: [ // NEW FIELD
      { key: 1, date: '2025-06-15', user: 'System', status: 'Abnormal', text: 'AC น้อยกว่า FC เกิน 20% (Auto Alert)' },
    ],
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
    KeyRemarks: [ // NEW FIELD
        { key: 1, date: '2025-06-18', user: 'Planner A', status: 'Abnormal', text: 'ตรวจสอบแล้ว คาดว่า Sale Out จะดีขึ้นหลังแคมเปญ' },
    ],
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
    KeyRemarks: [],
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
    KeyRemarks: [],
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
    KeyRemarks: [],
  },
];

const mockInventoryData = [
  ...initialInventoryData,
  ...initialInventoryData.map((item, index) => ({
    ...item,
    Code: `${item.Code}-copy-${index}`,
    Description: `${item.Description} (Duplicate)`,
    RemarkTrade: item.RemarkTrade.includes("Duplicate")
      ? item.RemarkTrade
      : `[Original: ${item.RemarkTrade}]`,
    KeyRemarks: [...item.KeyRemarks, { key: 100 + index, date: '2025-06-20', user: 'Manager B', status: item.สถานะTrade, text: 'ติดตามสถานะการจัดการโดย Manager B' }],
  })),
];

// --- Helper Functions (สำหรับแสดงผล) ---
const formatCurrency = (amount) => {
  return `฿${(amount || 0).toLocaleString()}`;
};

const getDOHStyle = (doh) => {
  if (doh === null || doh === undefined) return "text-gray-500";
  if (doh > 365) return "text-red-600 font-extrabold bg-red-50";
  if (doh > 180) return "text-orange-600 font-bold";
  return "text-green-600 font-bold";
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Abnormal":
      return "bg-red-100 text-red-800 border-red-300";
    case "Normal":
      return "bg-green-100 text-green-800 border-green-300";
    case "Resolved":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"; // สถานะใหม่
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// --- Trade Communication Modal Component ---
const TradeCommunicationModal = ({
  item,
  onClose,
  onSubmit,
  currentData, // { comment, newStatus }
  onDataChange, // function
}) => {
  const statusOptions = ["Normal", "Abnormal", "Resolved", "Pending"];

  // ใช้ useMemo เพื่อให้ KeyRemarks ไม่ถูกคำนวณซ้ำทุกครั้งที่ Component Render
  const sortedRemarks = useMemo(() => {
      // เรียงตามวันที่ล่าสุดขึ้นก่อน
      return (item.KeyRemarks || []).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [item.KeyRemarks]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-start mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-[#640037]">
                Action & Communication: {item.Code}
            </h2>
            <button onClick={onClose} className="text-2xl text-gray-500 hover:text-red-500 font-light">&times;</button>
        </div>
        <p className="text-sm text-gray-600 mb-4">{item.Description}</p>

        {/* --- Remark History Section --- */}
        <div className="mb-4">
            <h3 className="text-md font-semibold text-gray-700 mb-2">ประวัติการสื่อสาร ({sortedRemarks.length})</h3>
            <div className="h-48 overflow-y-auto p-3 border rounded-lg bg-gray-50 space-y-3">
                {sortedRemarks.length > 0 ? sortedRemarks.map((remark, index) => (
                    <div key={index} className="border-l-4 border-pink-400 pl-3 py-1 bg-white rounded shadow-sm">
                        <p className="font-semibold text-sm flex justify-between items-center">
                            <span>{remark.user}</span> 
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusStyle(remark.status)}`}>
                                {remark.status}
                            </span>
                        </p>
                        <p className="text-gray-800 text-sm">{remark.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{remark.date}</p>
                    </div>
                )) : (
                    <p className="text-gray-500 text-center pt-8">ยังไม่มีบันทึกการสื่อสาร/ติดตาม</p>
                )}
            </div>
        </div>

        {/* --- Action/New Remark Section --- */}
        <div className="mt-6 pt-4 border-t border-gray-200">
            {/* Status Dropdown */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Change Status:
                </label>
                <select
                    value={currentData.newStatus}
                    onChange={(e) => onDataChange('newStatus', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#640037] focus:border-[#640037]"
                >
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Comment Textarea */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Remark (บันทึก Action ใหม่):
                </label>
                <textarea
                    value={currentData.comment}
                    onChange={(e) => onDataChange('comment', e.target.value)}
                    rows="3"
                    placeholder="พิมพ์บันทึกการสื่อสารหรืออัพเดทสถานะการจัดการ..."
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 resize-none"
                ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition duration-150 disabled:bg-pink-300"
                    disabled={!currentData.comment.trim()}
                >
                    Submit Action & Save Remark
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function InventoryTradeMonitor() {
  const [data, setData] = useState(mockInventoryData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // NEW State: รวม comment และ newStatus
  const [modalData, setModalData] = useState({
      comment: "",
      newStatus: "Pending", // Default status
  });
  
  // Hardcoded current user for demonstration
  const CURRENT_USER = "Trade Planner (Key)";

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    // Initial data load
    setModalData({
        comment: "", // เริ่มจากข้อความว่าง เพื่อบังคับให้บันทึกใหม่
        newStatus: item.สถานะTrade || "Pending",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalData({ comment: "", newStatus: "Pending" });
  };
  
  const handleModalDataChange = (name, value) => {
      setModalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAction = () => {
    if (!selectedItem || !modalData.comment.trim()) {
        alert("กรุณาเพิ่มข้อความ Remark ก่อนทำการบันทึก Action");
        return;
    }

    const newRemark = {
        key: Date.now(),
        date: new Date().toISOString().slice(0, 10), // Format YYYY-MM-DD
        user: CURRENT_USER,
        status: modalData.newStatus,
        text: modalData.comment.trim(),
    };

    // Logic to update the item in the data array
    const updatedData = data.map((item) =>
      item.Code === selectedItem.Code
        ? {
            ...item,
            // 1. อัปเดทสถานะ (สถานะTrade)
            สถานะTrade: modalData.newStatus, 
            // 2. อัปเดท RemarkTrade ที่แสดงในตารางให้เป็นข้อความล่าสุด
            RemarkTrade: modalData.comment.trim(),
            // 3. บันทึก New Remark ลงในประวัติ KeyRemarks
            KeyRemarks: [...(item.KeyRemarks || []), newRemark],
          }
        : item
    );

    setData(updatedData);
    handleCloseModal();
    
    // Log ข้อมูลที่สื่อสารกัน (ตามที่ร้องขอ)
    console.log("--- New Trade Action Log ---");
    console.log(`SKU: ${selectedItem.Code}`);
    console.log(`Action By: ${newRemark.user}`);
    console.log(`New Status: ${newRemark.status}`);
    console.log(`Remark: ${newRemark.text}`);
    console.log(`Timestamp: ${newRemark.date}`);
    console.log("----------------------------");
    alert(`บันทึก Action สำหรับ ${selectedItem.Code} เป็นสถานะ ${modalData.newStatus} เรียบร้อยแล้ว`);
  };

  const totalSKUs = data.length;
  const totalStock = data.reduce(
    (sum, item) => sum + (item.Stock_จบเหลือจริง || 0),
    0
  );
  const avgDOH =
    totalSKUs > 0
      ? data.reduce((sum, item) => sum + (item.DayOnHand_DOH_Stock2 || 0), 0) /
        totalSKUs
      : 0;
  const abnormalCount = data.filter(
    (item) => item.สถานะTrade === "Abnormal"
  ).length;

  return (
    <div className="p-8 bg-white shadow-2xl rounded-xl">
      {/* --- Header & Summary --- */}
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
          Inventory & Trade Monitor
        </h1>
        <p className="text-gray-500">
          ข้อมูลคงคลัง (Stock) และยอดขาย (Sale Out)
          พร้อมช่องทางการบันทึกและติดตาม **Action/Communication**
        </p>
      </header>

      {/* --- Key Metrics (Condensed Summary) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-pink-50 p-4 rounded-lg shadow-inner">
          <p className="text-sm text-pink-600 font-semibold">Total SKUs</p>
          <p className="text-2xl font-extrabold text-[#640037]">
            {totalSKUs}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
          <p className="text-sm text-blue-600 font-semibold">Total Stock</p>
          <p className="text-2xl font-extrabold">
            {totalStock.toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-inner">
          <p className="text-sm text-yellow-600 font-semibold">
            Avg. DOH (Stock)
          </p>
          <p className="text-2xl font-extrabold">
            {avgDOH.toFixed(0).toLocaleString()} วัน
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-inner">
          <p className="text-sm text-red-600 font-semibold">Abnormal Count</p>
          <p className="text-2xl font-extrabold">{abnormalCount}</p>
        </div>
      </div>

      {/* --- Data Table Container --- */}
      <div className="overflow-x-auto shadow-xl rounded-xl">
        <table className="min-w-full table-auto border-collapse bg-white">
          <thead className="bg-[#640037] text-white sticky top-0">
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
              <th className="p-3 text-left w-[200px]">Remark Trade (ล่าสุด)</th>
              <th className="p-3 text-center w-[80px]">Action</th> 
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.Code}
                className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
              >
                {/* Code/Brand */}
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

                {/* Remark Trade (ล่าสุด) */}
                <td className="p-3 text-left text-sm max-w-xs whitespace-normal text-gray-600">
                  {item.RemarkTrade || "-"}
                </td>

                {/* Action Column */}
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-3 py-1 rounded-2xl transition duration-150 shadow-md"
                  >
                    บันทึก/ดูการสื่อสาร ({item.KeyRemarks ? item.KeyRemarks.length : 0})
                  </button>
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
      </div>

      {/* --- Trade Communication Modal --- */}
      {isModalOpen && selectedItem && (
        <TradeCommunicationModal
          item={selectedItem}
          onClose={handleCloseModal}
          onSubmit={handleSubmitAction}
          currentData={modalData}
          onDataChange={handleModalDataChange}
        />
      )}
    </div>
  );
}