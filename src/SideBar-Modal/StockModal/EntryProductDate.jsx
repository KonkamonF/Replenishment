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
// สมมติว่าไฟล์นี้อยู่ระดับเดียวกับ EntryProductDate.jsx
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

// ==============================================
// 🎯 MOCK DATA และ MOCK FUNCTION
// ==============================================
const MOCK_PRODUCTS = {
  "09-4418-01": { name: "SINK TNP 4418 BLACK", initialQuantity: 20 },
  "09-4521-01": { name: "SINK TNP 784521 BLACK", initialQuantity: 30 },
  "09-0001-01": { name: "SINK TNP GIN 1B1D BLACK", initialQuantity: 140 },
};

// ฟังก์ชันจำลองการดึงข้อมูลสินค้าจากรหัส
const fetchProductMock = (sku) => {
  return new Promise((resolve) => {
    // จำลองการหน่วงเวลา
    setTimeout(() => {
      const product = MOCK_PRODUCTS[sku.toUpperCase()];
      if (product) {
        resolve({
          productName: product.name,
          quantity: product.initialQuantity,
          description: `รายการนำเข้า: ${sku}`,
        });
      } else {
        resolve({
          productName: `**ไม่พบชื่อสินค้า** (${sku})`,
          quantity: 1,
          description: `-`,
        });
      }
    }, 300); // หน่วง 300ms ให้เห็นผลการโหลด
  });
};
// ==============================================
// ==============================================

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

  // State เดิม (ใช้ใน Edit Mode)
  const [productName, setProductName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [comments, setComments] = useState("");
  const [entryDate, setEntryDate] = useState(formatDateForInput(selectedDate));

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  // 🎯 STATE ใหม่สำหรับ Multiple Entry
  const [productNamesInput, setProductNamesInput] = useState(""); // สำหรับ textarea รหัสสินค้า
  const [newProductList, setNewProductList] = useState([]); // รายการสินค้าที่จะบันทึก
  const [isFetchingMock, setIsFetchingMock] = useState(false); // สถานะการดึง Mock

  useEffect(() => {
    setEntries(entries);
  }, [entries]);

  // 🎯 useEffect สำหรับแปลง Input เป็นตาราง Preview
  useEffect(() => {
    const fetchNewProductData = async () => {
      const skus = productNamesInput
        .split("\n")
        .map((item) => item.trim().toUpperCase())
        .filter((item) => item !== "");

      if (skus.length === 0) {
        setNewProductList([]);
        return;
      }

      setIsFetchingMock(true);

      const existingMap = new Map(
        newProductList.map((item) => [item.sku, item])
      );

      const fetchedProducts = await Promise.all(
        skus.map(async (sku) => {
          const mockData = await fetchProductMock(sku);
          const existingItem = existingMap.get(sku);

          return {
            sku: sku,
            productName: mockData.productName,
            // ใช้ quantity และ description เดิมถ้ามี, ถ้าไม่มีใช้จาก mock
            quantity:
              existingItem && existingItem.sku === sku
                ? existingItem.quantity
                : mockData.quantity,
            description:
              existingItem && existingItem.sku === sku
                ? existingItem.description
                : mockData.description,
          };
        })
      );

      // กรองรายการที่ไม่ซ้ำกัน
      const uniqueFetchedProducts = fetchedProducts.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.sku === item.sku)
      );

      setNewProductList(uniqueFetchedProducts);
      setIsFetchingMock(false);
    };

    // หน่วงเวลาเล็กน้อยเพื่อไม่ให้เรียกบ่อยเกินไปขณะผู้ใช้พิมพ์
    const delayDebounceFn = setTimeout(() => {
      fetchNewProductData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [productNamesInput]);

  // 🎯 ฟังก์ชันจัดการการเปลี่ยนจำนวนในตาราง Preview
  const handleQuantityChange = (sku, value) => {
    setNewProductList((prevList) =>
      prevList.map((item) =>
        item.sku === sku ? { ...item, quantity: parseInt(value) || 0 } : item
      )
    );
  };

  // 🎯 ฟังก์ชันจัดการการเปลี่ยน Description ในตาราง Preview
  const handleDescriptionChange = (sku, value) => {
    setNewProductList((prevList) =>
      prevList.map((item) =>
        item.sku === sku ? { ...item, description: value } : item
      )
    );
  };

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
    setProductNamesInput(""); // 🎯 reset state ใหม่
    setNewProductList([]); // 🎯 reset state ใหม่
    if (fileInputRef.current) fileInputRef.current.value = null;
  };
  const closeModal = () => {
    setIsEntryProductDate(false);
  };

  // ===================== HANDLE ADD (ปรับสำหรับ Multiple Entry) ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // กรองรายการที่มีจำนวน > 0 และไม่ใช่ "ไม่พบชื่อสินค้า"
    const validEntries = newProductList.filter(
      (item) =>
        item.quantity > 0 &&
        item.productName &&
        !item.productName.includes("**ไม่พบชื่อสินค้า**")
    );

    if (validEntries.length === 0)
      return alert("กรุณาป้อนรหัสสินค้าที่ถูกต้องและระบุจำนวนมากกว่า 0");
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 💡 วนลูปเรียก addEntry สำหรับแต่ละรายการ
      for (let i = 0; i < validEntries.length; i++) {
        const item = validEntries[i];
        await addEntry({
          productName: item.productName, // ชื่อสินค้าจาก Mock
          poNumber: item.sku, // ใช้ SKU เป็น PO/รหัสสินค้าหลัก
          quantity: item.quantity,
          supplier: supplier, // ใช้ supplier ร่วมกัน
          comments: item.description + (comments ? ` | Note: ${comments}` : ""), // ผนวก Description และ Comments
          entryDate,
          // ส่งรูปภาพทั้งหมดกับรายการแรกเท่านั้น
          images: i === 0 ? imageFiles.map((f) => f.file) : [],
          status: "F",
        });
      }

      await fetchByDate(entryDate);
      alert(`บันทึกข้อมูลสินค้า ${validEntries.length} รายการเรียบร้อยแล้ว`);
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

  // ====================== MODE DETAIL (ปรับปรุง) ======================
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
    if (isSubmitting) return;

    setIsSubmitting(true);

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
      setIsSubmitting(false);
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

        {/* ======================== LIST MODE (โค้ดเดิม) ======================== */}
        {mode === "list" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-700">
                รายการสินค้าที่จะเข้าวันนี้ ({Entries.length} รายการ)
              </h2>
              <button
                onClick={() => {
                  setMode("add");
                  resetForm();
                }}
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
        {/* ======================== ADD MODE (ปรับปรุงใหม่) ======================== */}
        {mode === "add" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-700">
                เพิ่มรายการสินค้าใหม่ (หลายรายการ)
              </h2>
              <button
                type="button"
                onClick={() => setMode("list")}
                className="text-sm text-gray-500 hover:text-[#640037]"
              >
                ← กลับไปหน้ารายการ
              </button>
            </div>
            {/* 🎯 ส่วนป้อนรหัสสินค้า (ใช้ textarea) */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                  <Package className="w-4 h-4 mr-2 text-[#640037]" />
                  **รหัสสินค้า (ป้อนรายการละ 1 บรรทัด)***
                </label>
                <textarea
                  value={productNamesInput}
                  onChange={(e) => setProductNamesInput(e.target.value)}
                  placeholder="เช่น&#10;09-4418-01&#10;09-4418-01&#10;09-4418-01"
                  className="w-full p-2 border border-gray-300 rounded-lg h-32"
                  required
                ></textarea>
              </div>
            </div>

            {/* 🎯 ตารางแสดงตัวอย่างข้อมูล (Preview Table) */}
            {newProductList.length > 0 && (
              <div className="border p-4 rounded-lg bg-yellow-50/50">
                <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                  <Edit2 className="w-4 h-4 mr-2 text-gray-600" />{" "}
                  ตรวจสอบและแก้ไขจำนวน/รายละเอียด
                  {isFetchingMock && (
                    <span className="ml-3 text-sm text-gray-500 italic">
                      กำลังโหลดข้อมูล...
                    </span>
                  )}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-3 py-2 w-24">
                          รหัสสินค้า
                        </th>
                        <th scope="col" className="px-3 py-2 min-w-[200px]">
                          ชื่อสินค้า
                        </th>
                        <th scope="col" className="px-3 py-2 w-28">
                          จำนวน*
                        </th>
                        <th scope="col" className="px-3 py-2 min-w-[250px]">
                          ชื่อสินค้า Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {newProductList.map((item) => (
                        <tr
                          key={item.sku}
                          className={`bg-white border-b ${
                            item.productName.includes("**ไม่พบชื่อสินค้า**")
                              ? "bg-red-50/50"
                              : ""
                          }`}
                        >
                          <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                            {item.sku}
                          </td>
                          <td className="px-3 py-2">{item.productName}</td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item.sku, e.target.value)
                              }
                              className="w-full p-1 border border-gray-300 rounded-lg text-center"
                              required
                              min="0"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleDescriptionChange(
                                  item.sku,
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border border-gray-300 rounded-lg"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* ⬆️ สิ้นสุดตาราง Preview ⬆️ */}

            <div className="grid grid-cols-2 gap-6">
              {/* 🎯 วันที่สินค้าเข้า */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                  <Hash className="w-4 h-4 mr-2 text-[#640037]" />
                  วันที่สินค้าเข้า
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-[#640037]" />
                หมายเหตุ (หมายเหตุหลัก/ใช้ร่วมกัน)
              </label>
              <textarea
                rows="3"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              ></textarea>
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                type="submit"
                disabled={
                  isSubmitting || newProductList.length === 0 || isFetchingMock
                }
                className="bg-[#640037] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition disabled:opacity-70"
              >
                {isSubmitting
                  ? "กำลังบันทึก..."
                  : `บันทึกข้อมูล (${newProductList.length} รายการ)`}
              </button>
            </div>
          </form>
        )}

        {/* ======================== DETAIL MODE (ปรับปรุง) ======================== */}
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
              {/* 🎯 PO Number คือรหัสสินค้าที่ป้อน */}
           <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-3 py-2 w-24">
                          รหัสสินค้า
                        </th>
                        <th scope="col" className="px-3 py-2 min-w-[200px]">
                          ชื่อสินค้า
                        </th>
                        <th scope="col" className="px-3 py-2 w-28">
                          จำนวน*
                        </th>
                        <th scope="col" className="px-3 py-2 min-w-[250px]">
                          ชื่อสินค้า Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {newProductList.map((item) => (
                        <tr
                          key={item.sku}
                          className={`bg-white border-b ${
                            item.productName.includes("**ไม่พบชื่อสินค้า**")
                              ? "bg-red-50/50"
                              : ""
                          }`}
                        >
                          <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                            {item.sku}
                          </td>
                          <td className="px-3 py-2">{item.productName}</td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item.sku, e.target.value)
                              }
                              className="w-full p-1 border border-gray-300 rounded-lg text-center"
                              required
                              min="0"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleDescriptionChange(
                                  item.sku,
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border border-gray-300 rounded-lg"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>

            <div className="pt-4 flex gap-2 border-t mt-4">
              <button
                onClick={() => beginEdit(selectedItem)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Edit2 size={16} className="mr-1" /> แก้ไข
              </button>
              <button
                onClick={async () => {
                  await handleDelete(selectedItem);
                }}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <Trash2 size={16} className="mr-1" /> ลบรายการ
              </button>
            </div>
          </div>
        )}

        {/* ======================== EDIT MODE (โค้ดเดิม) ======================== */}
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
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>สถานะ:</strong>
                  {selectedItem.status === "T" ? (
                    <span className="font-bold text-green-600">รับแล้ว</span>
                  ) : (
                    <span className="font-bold text-red-600">ยังไม่ได้รับ</span>
                  )}
                </p>
               <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-3 py-2 w-24">
                          รหัสสินค้า
                        </th>
                        <th scope="col" className="px-3 py-2 min-w-[200px]">
                          ชื่อสินค้า
                        </th>
                        <th scope="col" className="px-3 py-2 w-28">
                          จำนวน*
                        </th>
                        <th scope="col" className="px-3 py-2 min-w-[250px]">
                          ชื่อสินค้า Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {newProductList.map((item) => (
                        <tr
                          key={item.sku}
                          className={`bg-white border-b ${
                            item.productName.includes("**ไม่พบชื่อสินค้า**")
                              ? "bg-red-50/50"
                              : ""
                          }`}
                        >
                          <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                            {item.sku}
                          </td>
                          <td className="px-3 py-2">{item.productName}</td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item.sku, e.target.value)
                              }
                              className="w-full p-1 border border-gray-300 rounded-lg text-center"
                              required
                              min="0"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleDescriptionChange(
                                  item.sku,
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border border-gray-300 rounded-lg"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

            <div className="pt-2 border-t flex justify-end">
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
