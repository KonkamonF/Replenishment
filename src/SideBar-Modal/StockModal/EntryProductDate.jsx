import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  Package,
  User,
  Hash,
  MessageSquare,
  X,
  Trash2,
  Edit2,
  Plus,
} from "lucide-react";
import { useProductEntry } from "../../hooks/useProductEntry.js";

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
  const { addEntry, updateEntry, deleteEntry, toggleStatus } =
    useProductEntry(token);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null)
  const [mode, setMode] = useState("list"); // "list" | "add" | "detail" | "edit"
  const [selectedItem, setSelectedItem] = useState(null);
  const [productName, setProductName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [comments, setComments] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const entryDate = formatDateForInput(selectedDate);
  const [Entries, setEntries] = useState(entries);
  useEffect(() => {
    setEntries(entries);
  }, [entries]);

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

  const resetForm = () => {
    setProductName("");
    setSupplier("");
    setPoNumber("");
    setQuantity("");
    setComments("");
    setImageFiles([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName) return alert("กรุณากรอกชื่อสินค้า");
    if (isSubmitting) return; // 👈 1. ป้องกันการกดซ้ำ

    setIsSubmitting(true); // 👈 2. เริ่ม Loading
    try {
      await addEntry({
        productName,
        poNumber,
        quantity: parseInt(quantity) || 0,
        supplier,
        comments,
        entryDate,
        images: imageFiles.map((f) => f.file),
        status: "F",
      });
      await fetchByDate(entryDate);
      alert(" บันทึกข้อมูลเรียบร้อยแล้ว");
      resetForm();
      setMode("list");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSubmitting(false); // 👈 3. หยุด Loading เสมอ (ไม่ว่าจะสำเร็จหรือล้มเหลว)
    }
  };

  // ==========================================================
  //  1. เพิ่มฟังก์ชันสำหรับจัดการการ Toggle สถานะ
  // ==========================================================
  const handleToggleStatus = async (item) => {
    if (loadingItemId === item.id) return; // 👈 1. ป้องกันการกดซ้ำ (เฉพาะรายการนี้)

    const newStatus = item.status === "T" ? "F" : "T";
    setLoadingItemId(item.id); // 👈 2. เริ่ม Loading (เฉพาะรายการนี้)

    try {
      await toggleStatus(item.id, item.status, entryDate);
      setEntries((prev) =>
        prev.map((x) => (x.id === item.id ? { ...x, status: newStatus } : x))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    } finally {
      setLoadingItemId(null); // 👈 3. หยุด Loading
    }
  };

  // (วางฟังก์ชันนี้ไว้ใกล้ๆ กับ handleToggleStatus)
  const handleDelete = async (item) => {
    if (loadingItemId === item.id) return; // 👈 1. ป้องกันการกดซ้ำ

    // (Optional) เพิ่มการยืนยัน
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${item.productName}"?`)) {
      return;
    }

    setLoadingItemId(item.id); // 👈 2. เริ่ม Loading
    try {
      await deleteEntry(item.id, entryDate);
      await fetchByDate(entryDate);
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("เกิดข้อผิดพลาดในการลบ");
    } finally {
      setLoadingItemId(null); // 👈 3. หยุด Loading
    }
  };
  // ==========================================================

  const openDetail = (item) => {
    setSelectedItem(item);
    setMode("detail");
  };

  const displayDate = selectedDate
    ? new Date(
        selectedDate.year,
        selectedDate.month,
        selectedDate.day
      ).toLocaleDateString("th-TH", { dateStyle: "long" })
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

        {/* ===================== MODE LIST ===================== */}
        {mode === "list" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-700">
                รายการสินค้าที่จะเข้าวันนี้ ({entries.length} รายการ)
              </h2>
              <button
                onClick={() => setMode("add")}
                className="flex items-center bg-[#640037] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                <Plus size={18} className="mr-1" /> เพิ่มรายการใหม่
              </button>
            </div>

            {entries.length === 0 && (
              <p className="text-gray-500 italic">ยังไม่มีรายการสำหรับวันนี้</p>
            )}

            <div className="space-y-2">
              {Entries.map((item) => {
                //  ตรวจสอบสถานะ (ค่าเริ่มต้นคือ 'F' = สีแดง)
                const isT = item.status === "T";

                return (
                  <div
                    key={item.id}
                    onClick={() => openDetail(item)}
                    className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border cursor-pointer hover:bg-pink-50 transition"
                  >
                    <div className="text-sm text-gray-700">
                      <strong>{item.productName}</strong> — {item.quantity} ชิ้น
                      <p className="text-xs text-gray-500">
                        {item.poNumber || "-"} | {item.supplier || "-"}
                      </p>
                    </div>
                    {/* ================================================== */}
                    {/*  2. อัปเดต UI ให้มีปุ่ม Toggle และปุ่มลบ */}
                    {/* ================================================== */}
                    // ... (Entries.map)
                    <div className="flex items-center gap-3">
                      {/* ปุ่ม Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(item);
                        }}
                        disabled={loadingItemId === item.id} // 👈 ปิดปุ่ม
                        title={item.status === "T" ? "รับแล้ว" : "ยังไม่ได้รับ"}
                        className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors duration-200 ease-in-out ${
                          item.status === "T" ? "bg-green-500" : "bg-red-500"
                        } ${
                          loadingItemId === item.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`} // 👈 เพิ่ม style ตอน disable
                      >
                        {/* ... (span bên trong vẫn như cũ) ... */}
                        <span
                          className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                            item.status === "T"
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        ></span>
                      </button>
                      {/* ปุ่มลบ */}
                      // ... (mode === "detail")
                      <div className="pt-4 flex gap-2 border-t mt-4">
                        {/* ... (ปุ่มแก้ไข) ... */}
                        <button
                          onClick={async () => {
                            if (loadingItemId === selectedItem.id) return; // 👈 1. ป้องกัน

                            setLoadingItemId(selectedItem.id); // 👈 2. เริ่ม Loading
                            try {
                              await deleteEntry(selectedItem.id, entryDate);
                              await fetchByDate(entryDate);
                              setMode("list");
                            } catch (err) {
                              console.error("Failed to delete:", err);
                              alert("ลบไม่สำเร็จ");
                              setLoadingItemId(null); // 👈 3. หยุด Loading (กรณี error)
                            } finally {
                              // (ไม่ต้องมี finally ที่นี่ เพราะถ้าสำเร็จ setMode('list') จะทำงาน)
                              // (แก้ไข: เพิ่ม finally เพื่อความปลอดภัย)
                              setLoadingItemId(null);
                            }
                          }}
                          disabled={loadingItemId === selectedItem.id} // 👈 4. ปิดปุ่ม
                          className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50" // 👈 5. เพิ่ม style
                        >
                          <Trash2 size={16} className="mr-1" />
                          {loadingItemId === selectedItem.id
                            ? "กำลังลบ..."
                            : "ลบรายการ"}{" "}
                          {/* 👈 6. เปลี่ยนข้อความ */}
                        </button>
                      </div>
                    </div>
                    {/* ================================================== */}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== MODE ADD ===================== */}
        {mode === "add" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-700">
                เพิ่มรายการสินค้าใหม่
              </h2>
              <button
                type="button"
                onClick={() => setMode("list")}
                className="text-sm text-gray-500 hover:text-[#640037]"
              >
                ← กลับไปหน้ารายการ
              </button>
            </div>
            {/* ฟอร์มเดิมทั้งหมด */}
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
                disabled={isSubmitting} // 👈 1. ปิดปุ่ม
                className="bg-[#640037] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed" // 👈 2. เพิ่ม style
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}{" "}
                {/* 👈 3. เปลี่ยนข้อความ */}
              </button>
            </div>
          </form>
        )}

        {/* ===================== MODE DETAIL ===================== */}
        {mode === "detail" && selectedItem && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-700">
                รายละเอียดสินค้า
              </h2>
              <button
                onClick={() => setMode("list")}
                className="text-sm text-gray-500 hover:text-[#640037]"
              >
                ← กลับไปหน้ารายการ
              </button>
            </div>

            <div className="space-y-2 text-gray-700">
              {/*  แสดงสถานะในหน้า Detail ด้วย */}
              <p>
                <strong>สถานะ:</strong>{" "}
                {selectedItem.status === "T" ? (
                  <span className="font-bold text-green-600">รับแล้ว</span>
                ) : (
                  <span className="font-bold text-red-600">ยังไม่ได้รับ</span>
                )}
              </p>
              <p>
                <strong>ชื่อสินค้า:</strong> {selectedItem.productName}
              </p>
              <p>
                <strong>จำนวน:</strong> {selectedItem.quantity} ชิ้น
              </p>
              <p>
                <strong>PO:</strong> {selectedItem.poNumber || "-"}
              </p>
              <p>
                <strong>ซัพพลายเออร์:</strong> {selectedItem.supplier || "-"}
              </p>
              <p>
                <strong>หมายเหตุ:</strong> {selectedItem.comments || "-"}
              </p>
            </div>

            {selectedItem.images?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">รูปภาพแนบ:</h3>
                <div className="flex overflow-x-auto gap-3">
                  {selectedItem.images.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="preview"
                      className="w-40 h-28 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-2 border-t mt-4">
              <button
                onClick={() => {
                  setProductName(selectedItem.productName);
                  setSupplier(selectedItem.supplier);
                  setPoNumber(selectedItem.poNumber);
                  setQuantity(selectedItem.quantity);
                  setComments(selectedItem.comments);
                  // TODO: คุณยังไม่ได้สร้าง UI สำหรับ "edit" mode
                  setMode("edit");
                }}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Edit2 size={16} className="mr-1" /> แก้ไข
              </button>
              <button
                onClick={async () => {
                  await deleteEntry(selectedItem.id, entryDate);
                  await fetchByDate(entryDate); //  โหลดใหม่หลังลบ
                  setMode("list");
                }}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <Trash2 size={16} className="mr-1" /> ลบรายการ
              </button>
            </div>
          </div>
        )}

        {mode === "edit" && (
          <div className="text-center p-10">
            <h2 className="text-xl font-bold">Edit Mode (TODO)</h2>
            <p className="text-gray-500">
              ส่วนของการแก้ไขข้อมูลยังไม่ได้ถูกสร้าง UI
            </p>
            <button
              onClick={() => setMode("detail")}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              ← กลับไปหน้ารายละเอียด
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
