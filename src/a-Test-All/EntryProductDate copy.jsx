import React, { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  Package,
  User,
  Hash,
  MessageSquare,
  X,
  Trash2,
} from "lucide-react";
import { useProductEntry } from "../hooks/useProductEntry";

const formatDateForInput = (date) => {
  if (!date) return "";
  const m = String(date.month + 1).padStart(2, "0");
  const d = String(date.day).padStart(2, "0");
  return `${date.year}-${m}-${d}`;
};

export default function EntryProductDate({
  setIsEntryProductDate,
  selectedDate,
  entries = [],
  loading,
  fetchByDate,
}) {
  const token = import.meta.env.VITE_API_TOKEN;
  const { addEntry, deleteEntry } = useProductEntry(token);

  const [productName, setProductName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [comments, setComments] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const entryDate = formatDateForInput(selectedDate);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map((f) => ({
      id: `${f.name}-${f.lastModified}-${Math.random()}`,
      file: f,
      url: URL.createObjectURL(f),
    }));
    setImageFiles((prev) => [...prev, ...newItems]);
    setPreviews((prev) => [...prev, ...newItems]);
  };

  const removeImage = (id) => {
    setImageFiles((prev) => prev.filter((f) => f.id !== id));
    setPreviews((prev) => prev.filter((f) => f.id !== id));
  };

  //  ฟังก์ชันบันทึกข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !entryDate) {
      alert("กรุณากรอกชื่อสินค้าและวันที่ให้ครบถ้วน");
      return;
    }

    try {
      await addEntry({
        productName,
        poNumber,
        quantity: parseInt(quantity) || 0,
        supplier,
        comments,
        entryDate,
        images: imageFiles.map((f) => f.file),
      });

      alert(" บันทึกข้อมูลเรียบร้อยแล้ว!");

      // โหลดข้อมูลใหม่
      await fetchByDate(entryDate);

      // ล้างฟอร์ม
      setProductName("");
      setSupplier("");
      setPoNumber("");
      setQuantity("");
      setComments("");
      setImageFiles([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error(" Error while saving:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const displayDate = selectedDate
    ? new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString(
        "th-TH",
        { dateStyle: "long" }
      )
    : "ไม่พบวันที่";

  return (
    <div className="fixed inset-0 bg-[#000000ba] z-50 flex justify-center items-center">
      <div className="bg-white h-[90%] w-[75%] p-6 shadow-2xl z-50 overflow-y-auto rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037]">
            กำหนดสินค้าเข้าคลัง
            <p className="text-base font-normal text-gray-600 mt-1">
              สำหรับวันที่: {displayDate}
            </p>
          </h1>
          <button
            onClick={() => setIsEntryProductDate(false)}
            className="text-4xl text-gray-500 hover:text-[#640037] transition p-1 leading-none"
          >
            &times;
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-500">กำลังโหลดข้อมูล...</p>}

        {/* รายการของวันนั้น */}
        {!loading && entries.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-gray-700">
              รายการสินค้าที่จะเข้าวันนี้ ({entries.length} รายการ)
            </h2>
            <div className="space-y-2">
              {entries.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border"
                >
                  <div className="text-sm text-gray-700">
                    <strong>{item.productName}</strong> — {item.quantity} ชิ้น
                    <p className="text-xs text-gray-500">
                      {item.poNumber || "-"} | {item.supplier || "-"}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEntry(item.id, entryDate)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ฟอร์มเพิ่มข้อมูล */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                <Package className="w-4 h-4 mr-2 text-[#640037]" />
                ชื่อสินค้า / SKU*
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                <Hash className="w-4 h-4 mr-2 text-[#640037]" />
                เลขที่ PO
              </label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                <Hash className="w-4 h-4 mr-2 text-[#640037]" />
                จำนวน (Stock)*
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                <User className="w-4 h-4 mr-2 text-[#640037]" />
                ซัพพลายเออร์
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-[#640037]" />
              หมายเหตุ
            </label>
            <textarea
              rows="3"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <UploadCloud className="mr-2 text-[#640037]" />
              แนบรูปภาพ (ไม่จำกัดจำนวน)
            </label>

            {previews.length > 0 && (
              <div className="flex overflow-x-auto gap-3 pb-2">
                {previews.map((img) => (
                  <div
                    key={img.id}
                    className="relative flex-shrink-0 border rounded-lg overflow-hidden"
                  >
                    <img
                      src={img.url}
                      alt="preview"
                      className="w-40 h-28 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            />
          </div>

          <div className="pt-2 border-t flex justify-end">
            <button
              type="submit"
              className="bg-[#640037] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition transform hover:scale-[1.01]"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
