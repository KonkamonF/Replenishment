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

// 🍀 แปลง URL → path จริง เช่น /uploads/2025-11-11/abc.jpg
const convertUrlToPath = (url) => {
  if (!url) return "";
  const idx = url.indexOf("/uploads/");
  return url.substring(idx + 1); // ตัดโดเมนออก เหลือ uploads/xxx
};

export default function EntryProductDate({
  setIsEntryProductDate,
  selectedDate,
  entries = [],
  loading,
  fetchByDate,
}) {
  const token = import.meta.env.VITE_API_TOKEN;
  const { addEntry, updateEntry, deleteEntry, toggleStatus, prefetchMonth } =
    useProductEntry(token);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [mode, setMode] = useState("list"); // list | add | detail | edit
  const [selectedItem, setSelectedItem] = useState(null);
  const [Entries, setEntries] = useState(entries);

  const [productName, setProductName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [comments, setComments] = useState("");
  const [entryDate, setEntryDate] = useState(formatDateForInput(selectedDate));

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

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
  const closeModal = () => {
    setIsEntryProductDate(false);
  };
  // ===================== HANDLE ADD ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName) return alert("กรุณากรอกชื่อสินค้า");
    if (isSubmitting) return;

    setIsSubmitting(true);
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
      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      closeModal();
      resetForm();
      setMode("list");
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [productNamesInput, setProductNamesInput] = useState("");
  const productList = productNamesInput
    .split("\n") // แยกตามบรรทัดใหม่
    .map((item) => item.trim()) // ลบช่องว่างหัวท้าย
    .filter((item) => item !== ""); // กรองรายการว่าง

  // ====================== TOGGLE STATUS ======================
  const handleToggleStatus = async (item) => {
    if (loadingItemId === item.id) return;
    const newStatus = item.status === "T" ? "F" : "T";
    setLoadingItemId(item.id);

    try {
      await toggleStatus(item.id, item.status, entryDate);
      setEntries((prev) =>
        prev.map((x) => (x.id === item.id ? { ...x, status: newStatus } : x))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    } finally {
      setLoadingItemId(null);
    }
  };

  // ====================== DELETE ======================
  const handleDelete = async (item) => {
    if (!window.confirm(`ต้องการลบรายการ "${item.productName}" ?`)) return;
    if (loadingItemId === item.id) return;

    setLoadingItemId(item.id);
    try {
      await deleteEntry(item.id, entryDate);
      await fetchByDate(entryDate);
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("ลบไม่สำเร็จ");
    } finally {
      setLoadingItemId(null);
    }
  };

  // ====================== MODE DETAIL ======================
  const openDetail = (item) => {
    setSelectedItem(item);
    setMode("detail");
  };

  // ====================== MODE EDIT ======================
  const beginEdit = (item) => {
    setSelectedItem(item);
    setProductName(item.productName);
    setSupplier(item.supplier);
    setPoNumber(item.poNumber);
    setQuantity(item.quantity);
    setComments(item.comments);
    setEntryDate(item.entryDate);
    setImageFiles([]);
    setPreviews([]);
    setMode("edit");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // ⬇️ *** CHANGED HERE ***
    if (isSubmitting) return;

    setIsSubmitting(true);
    // ⬆️ *** CHANGED HERE ***

    const keepImages = selectedItem.images.map(convertUrlToPath);
    const newFiles = imageFiles.map((f) => f.file);

    try {
      await updateEntry({
        id: selectedItem.id,
        productName,
        poNumber,
        quantity: parseInt(quantity) || 0,
        supplier,
        comments,
        entryDate,
        status: selectedItem.status,
        keepImages,
        newImages: newFiles,
      });

      // โหลดข้อมูลวันใหม่
      await fetchByDate(entryDate);

      // โหลดข้อมูลเดือนใหม่ (เพื่อ update calendar)
      const [y, m] = entryDate.split("-");
      await prefetchMonth(parseInt(y), parseInt(m) - 1);

      alert("แก้ไขข้อมูลเรียบร้อยแล้ว");
      closeModal();
      setMode("list");
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    } finally {
      // ⬇️ *** CHANGED HERE ***
      setIsSubmitting(false);
      // ⬆️ *** CHANGED HERE ***
    }
  };

  // ====================== RENDER ======================
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
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037]">
            กำหนดสินค้าเข้าคลัง
            <p className="text-base font-normal text-gray-600 mt-1">
              สำหรับวันที่: {displayDate}
            </p>
          </h1>
          <button
            onClick={() => setIsEntryProductDate(false)}
            className="text-4xl text-gray-500 hover:text-[#640037] transition p-1"
          >
            ×
          </button>
        </div>

        {/* ======================== LIST MODE ======================== */}
        {mode === "list" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-700">
                รายการสินค้าที่จะเข้าวันนี้ ({Entries.length} รายการ)
              </h2>
              <button
                onClick={() => setMode("add")}
                className="flex items-center bg-[#640037] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                <Plus size={18} className="mr-1" /> เพิ่มรายการใหม่
              </button>
            </div>

            {Entries.length === 0 && (
              <p className="text-gray-500 italic">ยังไม่มีรายการสำหรับวันนี้</p>
            )}

            <div className="space-y-2">
              {Entries.map((item) => (
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

                  <div className="flex items-center gap-3">
                    {/* TOGGLE STATUS */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(item);
                      }}
                      disabled={loadingItemId === item.id}
                      title={item.status === "T" ? "รับแล้ว" : "ยังไม่ได้รับ"}
                      className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                        item.status === "T" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full shadow-md transform ${
                          item.status === "T"
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                      className="flex items-center bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================== ADD MODE ======================== */}
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

            {/* ฟอร์มเหมือนของเดิม */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                  <Package className="w-4 h-4 mr-2 text-[#640037]" />
                  รหัสสินค้า (ป้อนรายการละ 1 บรรทัด)
                </label>
                <textarea
                  value={productNamesInput}
                  onChange={(e) => setProductNamesInput(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg h-32"
                  required
                ></textarea>
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
                disabled={isSubmitting}
                className="bg-[#640037] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition disabled:opacity-70"
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </div>
          </form>
        )}

        {/* ======================== DETAIL MODE ======================== */}
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
                onClick={() => beginEdit(selectedItem)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Edit2 size={16} className="mr-1" /> แก้ไข
              </button>
              <button
                onClick={async () => {
                  await deleteEntry(selectedItem.id, entryDate);
                  await fetchByDate(entryDate);
                  setMode("list");
                }}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <Trash2 size={16} className="mr-1" /> ลบรายการ
              </button>
            </div>
          </div>
        )}

        {/* ======================== EDIT MODE ======================== */}
        {mode === "edit" && selectedItem && (
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-700">
                แก้ไขรายการสินค้า
              </h2>
              <button
                type="button"
                onClick={() => setMode("detail")}
                className="text-sm text-gray-500 hover:text-[#640037]"
              >
                ← กลับไปหน้ารายละเอียด
              </button>
            </div>

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
                <Hash className="w-4 h-4 mr-2 text-[#640037]" />
                วันที่สินค้าเข้า (ย้ายวันได้)
              </label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              />
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

            {/* รูปเดิม */}
            {selectedItem.images?.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  รูปภาพเดิม
                </label>
                <div className="flex overflow-x-auto gap-3 pb-2">
                  {selectedItem.images.map((url, i) => (
                    <div
                      key={i}
                      className="relative flex-shrink-0 border rounded-lg overflow-hidden"
                    >
                      <img
                        src={url}
                        alt="old"
                        className="w-40 h-28 object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedItem((prev) => ({
                            ...prev,
                            images: prev.images.filter((x) => x !== url),
                          }))
                        }
                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* รูปใหม่ */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <UploadCloud className="mr-2 text-[#640037]" />
                เพิ่มรูปใหม่
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
              {/* ⬇️ *** CHANGED HERE *** */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition disabled:opacity-70"
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
