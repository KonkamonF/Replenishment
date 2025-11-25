import React, { useState, useEffect } from "react";
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
  const oldStatus = item?.tradeStatus ?? "Normal"; // ใช้ nullish merge

  const { history, loading, saving, saveAction } =
    useTradeCommunication(itemCode);

  const [newStatus, setNewStatus] = useState(oldStatus);

  useEffect(() => {
    if (history.length > 0) {
      const latest = history[0]; // ประวัติล่าสุด index 0
      if (latest.newStatus) {
        setNewStatus(latest.newStatus);
        return;
      }
    }

    // fallback: ใช้สถานะจาก item
    if (item?.tradeStatus) {
      setNewStatus(item.tradeStatus);
    }
  }, [history, item]);

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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl p-6 overflow-y-auto max-h-full">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-2 border-b ">
          <h2 className="text-xl font-bold text-[#640037]">
            Action & Communication: {itemCode}
          </h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-500 cursor-pointer hover:text-red-500 font-light"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {item?.description || item?.Description}
        </p>

        {/* HISTORY */}
        <div className="mb-2">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            ประวัติการสื่อสาร ({history.length})
          </h3>

          <div className="h-[250px] p-3 border rounded-xl bg-gray-100 space-y-2 overflow-y-scroll">
            {loading ? (
              <p className="text-gray-500 text-center">กำลังโหลด...</p>
            ) : history.length === 0 ? (
              <p className="text-gray-500 text-center pt-4">
                ยังไม่มีประวัติการสื่อสาร
              </p>
            ) : (
              history.map((h) => (
                <div
                  key={h.id}
                  className="border-b-2 border-pink-500 px-3 py-2 bg-white rounded-xl shadow-lg"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{h.user}</span>

                    {h.newStatus && (
                      <span
                        className={`text-xs px-6 py-1 rounded-full ${getStatusStyle(
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
                      <p className="text-sm text-blue-600 mt-1">
                        เปลี่ยนสถานะ: {h.oldStatus} → {h.newStatus} 🔄
                      </p>
                    )}

                  {/* REMARK */}
                  <p className="text-gray-800 text-sm mt-1">{h.remark}</p>

                  {/* IMAGES */}
                  {h.images?.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-4">
                      {h.images.map((img, i) => (
                        <a
                          key={i}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={img}
                            className="w-18 h-18 rounded border object-cover cursor-pointer hover:opacity-80"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-end text-gray-600 mt-1">
                      {h.created_at}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NEW ACTION */}
        <div className="mt-4 ">
          <div className="flex items-start gap-6">
            {/* REMARK */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Remark
              </label>
              <textarea
                rows="3"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="พิมพ์บันทึกการสื่อสาร…"
                className="w-[700px] h-[80px] p-3 border border-gray-300 rounded-lg shadow-sm resize-none"
              />
            </div>

            {/* STATUS (เล็กลง) */}
            <div className="w-40 flex justify-center flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="p-1.5 text-sm border border-gray-300 rounded-lg shadow-sm"
              >
                <option value="Normal">Normal</option>
                <option value="Abnormal">Abnormal</option>
              </select>
            </div>

            {/* UPLOAD */}
            <div className="flex flex-col items-center">
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
                <div className="flex gap-2 mt-2 justify-center w-full h-26 p-2 overflow-x-scroll">
                  {images.map((f, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(f)}
                      className="w-18 h-18 rounded border object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
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
  );
}
