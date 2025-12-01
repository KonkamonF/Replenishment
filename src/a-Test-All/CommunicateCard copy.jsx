// TradeCommunicationModal.jsx

import React, { useMemo } from "react";
import { Upload } from "lucide-react";

// --- Mock Component for Uploadimg ---
const Uploadimg = () => (
  <div className="flex items-center justify-center p-2 mt-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-100 transition">
    <Upload className="w-4 h-4 mr-2" />
    {/* Mock Upload Image Text (Thai) */}
    แนบไฟล์รูปภาพ
  </div>
);

// --- Helper Functions (ต้องคัดลอกมาด้วย) ---
const getStatusStyle = (status) => {
  switch (status) {
    case "Abnormal": return "bg-red-100 text-red-800 border-red-300";
    case "Normal": return "bg-green-100 text-green-800 border-green-300";
    case "Resolved": return "bg-blue-100 text-blue-800 border-blue-300";
    case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};
// -----------------

/**
 * Modal Component สำหรับการบันทึก Action และดูประวัติการสื่อสารของสินค้า
 */
export default function CommunicationCard({ item, onClose, onSubmit, currentData, onDataChange }) {
  const statusOptions = ["Normal", "Abnormal", "Resolved", "Pending"];

  // เรียงลำดับประวัติ Remarks ล่าสุดขึ้นก่อน
  const sortedRemarks = useMemo(() => (item.KeyRemarks || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date)), [item.KeyRemarks]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 overflow-y-scroll max-h-full">
        <div className="flex justify-between items-start mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-[#640037]">Action & Communication: {item.Code}</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 cursor-pointer hover:text-red-500 font-light">&times;</button>
        </div>
        <p className="text-sm text-gray-600 mb-4">{item.Description}</p>

        {/* --- Remark History Section --- */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">ประวัติการสื่อสาร ({sortedRemarks.length})</h3>
          <div className="h-48 p-3 border rounded-lg bg-gray-50 space-y-3 overflow-y-scroll">
            {sortedRemarks.length > 0 ? (
              sortedRemarks.map((remark, index) => (
                <div key={index} className="border-l-4 border-pink-400 pl-3 py-1 bg-white rounded shadow-sm">
                  <p className="font-semibold text-sm flex justify-between items-center">
                    <span>{remark.user}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusStyle(remark.status)}`}>{remark.status}</span>
                  </p>
                  <p className="text-gray-800 text-sm">{remark.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{remark.date}</p>
                </div>
              ))
            ) : (<p className="text-gray-500 text-center pt-8">ยังไม่มีบันทึกการสื่อสาร/ติดตาม</p>)}
          </div>
        </div>

        {/* --- Action/New Remark Section --- */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Change Status:</label>
            <select value={currentData.newStatus} onChange={(e) => onDataChange("newStatus", e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#640037] focus:border-[#640037]">
              {statusOptions.map((status) => (<option key={status} value={status}>{status}</option>))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Remark (บันทึก Action ใหม่):</label>
            <textarea value={currentData.comment} onChange={(e) => onDataChange("comment", e.target.value)} rows="3" placeholder="พิมพ์บันทึกการสื่อสารหรืออัพเดทสถานะการจัดการ..." className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 resize-none"></textarea>
            <div><Uploadimg /></div>
          </div>

          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150">Cancel</button>
            <button onClick={onSubmit} className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition duration-150 disabled:bg-pink-300" disabled={!currentData.comment.trim()}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}