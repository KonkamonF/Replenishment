import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useTradeCommunication } from "../../hooks/useTradeCommunication";

const UploadImgBox = () => (
  <div className="flex items-center justify-center p-2 mt-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-100 transition">
    <Upload className="w-4 h-4 mr-2" />
    แนบไฟล์รูปภาพ
  </div>
);

const getStatusStyle = (status) => {
  switch (status) {
    case "Abnormal":
      return "bg-red-100 text-red-800 border-red-300";
    case "Normal":
      return "bg-green-100 text-green-800 border-green-300";
    case "Resolved":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export default function CommunicationCard({ item, onClose }) {
  const itemCode = item?.itemCode || item?.Code;
  const oldStatus = item?.tradeStatus || "Normal";

  const { history, loading, saving, saveAction } =
    useTradeCommunication(itemCode);

  const [newStatus, setNewStatus] = useState(oldStatus);
  const [remark, setRemark] = useState("");
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSave = async () => {
    if (!remark.trim()) {
      alert("กรุณาพิมพ์ Remark ก่อนบันทึก");
      return;
    }

    const ok = await saveAction({
      oldStatus,
      newStatus,
      remark,
      images,
    });

    if (ok) {
      alert("บันทึกสำเร็จ");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 overflow-y-scroll max-h-full">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-[#640037]">
            Action & Communication: {itemCode}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 cursor-pointer hover:text-red-500 font-light"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {item?.description || item?.Description}
        </p>

        {/* HISTORY */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            ประวัติการสื่อสาร ({history.length})
          </h3>

          <div className="h-48 p-3 border rounded-lg bg-gray-50 space-y-3 overflow-y-scroll">
            {loading ? (
              <p className="text-gray-400 text-center">กำลังโหลด...</p>
            ) : history.length === 0 ? (
              <p className="text-gray-500 text-center pt-8">
                ยังไม่มีประวัติการสื่อสาร
              </p>
            ) : (
              history.map((h) => (
                <div
                  key={h.id}
                  className="border-l-4 border-pink-400 pl-3 py-1 bg-white rounded shadow-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-sm">{h.user}</span>

                    {h.newStatus && (
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusStyle(
                          h.newStatus
                        )}`}
                      >
                        {h.newStatus}
                      </span>
                    )}
                  </div>

                  {/* STATUS CHANGE */}
                  {h.oldStatus &&
                    h.newStatus &&
                    h.oldStatus !== h.newStatus && (
                      <p className="text-xs text-blue-600 mt-1">
                        🔄 เปลี่ยนสถานะ: {h.oldStatus} → {h.newStatus}
                      </p>
                    )}

                  {/* REMARK */}
                  <p className="text-gray-800 text-sm mt-1">{h.remark}</p>

                  {/* IMAGES */}
                  {h.images?.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {h.images.map((img, i) => (
                        <a href={img} target="_blank" rel="noopener noreferrer">
                            <img
                                key={i}
                                src={img}
                                className="w-16 h-16 rounded border object-cover cursor-pointer hover:opacity-80"
                            />
                        </a>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-1">{h.created_at}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NEW ACTION */}
        <div className="mt-6 pt-4 border-t border-gray-200">

          {/* STATUS SELECT */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change Status:
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
              <option value="Resolved">Resolved</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* REMARK */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Remark:
            </label>
            <textarea
              rows="3"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="พิมพ์บันทึกการสื่อสาร…"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm resize-none"
            />

            {/* UPLOAD */}
            <input
              type="file"
              id="imgUploadBox"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="imgUploadBox">
              <UploadImgBox />
            </label>

            {/* PREVIEW */}
            {images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((f, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(f)}
                    className="w-16 h-16 rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={!remark.trim() || saving}
              className="px-4 py-2 text-sm text-white bg-pink-600 rounded-lg hover:bg-pink-700 disabled:bg-pink-300"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
