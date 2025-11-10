import React, { useState } from "react";
import {
  UploadCloud,
  Calendar as CalendarIcon,
  Package,
  User,
  Hash,
  MessageSquare,
} from "lucide-react";

// Helper: Format { year, month, day } to "YYYY-MM-DD"
const formatDateForInput = (date) => {
  if (
    !date ||
    typeof date.year !== "number" ||
    typeof date.month !== "number" ||
    typeof date.day !== "number"
  )
    return "";
  const formattedMonth = String(date.month + 1).padStart(2, "0");
  const formattedDay = String(date.day).padStart(2, "0");
  return `${date.year}-${formattedMonth}-${formattedDay}`;
};

export default function EntryProductDate({
  setIsEntryProductDate,
  selectedDate,
}) {
  const [productName, setProductName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [entryDate, setEntryDate] = useState(formatDateForInput(selectedDate));
  const [comments, setComments] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      productName,
      supplier,
      poNumber,
      quantity,
      entryDate,
      comments,
      imageFile,
    };
    console.log("Form Submitted:", formData);
    alert(`บันทึกข้อมูลสินค้าเข้า: ${productName} เรียบร้อย!`);
    setIsEntryProductDate(false);
  };

  const displayDate =
    selectedDate &&
    typeof selectedDate.year === "number" &&
    typeof selectedDate.month === "number" &&
    typeof selectedDate.day === "number"
      ? new Date(
          selectedDate.year,
          selectedDate.month,
          selectedDate.day
        ).toLocaleDateString("th-TH", {
          dateStyle: "long",
        })
      : "ไม่พบวันที่";

  return (
    <div className="fixed inset-0 bg-[#000000ba] z-50 flex justify-center items-center">
      <div className="bg-white h-[90%] w-[80%] p-6 shadow-2xl z-50 overflow-y-auto">
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
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex-grow overflow-y-auto pr-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                  <Package className="w-4 h-4 mr-2 text-[#640037]" />
                  ชื่อสินค้า / SKU*
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="เช่น วัตถุดิบ A (ล็อต 12/25)"
                  className="w-full p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition"
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
                  placeholder="เช่น บริษัท Supplier X จำกัด"
                  className="w-full p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                  <Hash className="w-4 h-4 mr-2 text-[#640037]" />
                  เลขที่ PO (Purchase Order)
                </label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  placeholder="PO-2025-001"
                  className="w-full p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition"
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
                  placeholder="0"
                  className="w-full p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-[#640037]" />
                    วันที่กำหนดเข้า*
                  </label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center ">
                    <UploadCloud className="w-4 h-4 mr-2 text-[#640037]" />
                    แนบรูปภาพ (เช่น ใบส่งของ)
                  </label>
                  {imagePreview && (
                    <div className="my-2 border rounded-lg p-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-[#640037]" />
                  คอมเมนต์ / หมายเหตุ
                </label>
                <textarea
                  rows="4"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="เช่น ส่งโดยรถทะเบียน กท-1234, ติดต่อคุณสมชาย..."
                  className="w-full p-2 border border-gray-300 hover:bg-amber-50 shadow-sm rounded-lg focus:ring focus:border-pink-700 focus:ring-pink-700 transition"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t flex justify-end mt-4">
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
