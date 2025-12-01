// src/SideBar-Modal/KeyFCMultiEntryModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { Package, X, Edit2, MessageSquare } from "lucide-react";

// ==============================================
// 🎯 MOCK DATA และ MOCK FUNCTION (นำมาจาก EntryProductDate.jsx)
// ==============================================
const MOCK_PRODUCTS = {
  "09-55555-001": { name: "KITCHEN HOOD A", class: "A", initialQuantity: 100 },
  "09-55555-002": { name: "SINK B MODEL", class: "B", initialQuantity: 50 },
  "09-55555-003": { name: "ACC MD ITEM", class: "MD", initialQuantity: 20 },
};

const fetchProductMock = (sku) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_PRODUCTS[sku.toUpperCase()];
      if (product) {
        resolve({
          productName: product.name,
          class: product.class, // เพิ่ม class
          quantity: 0, // เริ่มต้นด้วย 0
          description: product.name, 
        });
      } else {
        resolve({
          productName: `**ไม่พบชื่อสินค้า** (${sku})`,
          class: "-",
          quantity: 0,
          description: `-`,
        });
      }
    }, 300);
  });
};
// ==============================================

export default function KeyFCMultiEntryModal({ isModalOpen, setIsModalOpen, onSubmitProducts }) {
    const [productNamesInput, setProductNamesInput] = useState("");
    const [newProductList, setNewProductList] = useState([]);
    const [isFetchingMock, setIsFetchingMock] = useState(false);
    const [comments, setComments] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🎯 useEffect สำหรับแปลง Input เป็นตาราง Preview
    useEffect(() => {
        const fetchNewProductData = async () => {
            // 🔑 การเปลี่ยนหลัก: แยก SKU และ Quantity
            const inputLines = productNamesInput
                .split("\n")
                .map((item) => {
                    const parts = item.trim().split(/\s+/); // แยกด้วยช่องว่าง
                    const sku = parts[0].toUpperCase();
                    // ดึงจำนวน FC ถ้ามี และเป็นตัวเลขที่ถูกต้อง
                    const fcQuantity = parts.length > 1 && !isNaN(parseInt(parts[1])) ? parseInt(parts[1]) : null;
                    
                    return { sku, fcQuantity };
                })
                .filter((item) => item.sku !== ""); // กรองบรรทัดว่าง

            if (inputLines.length === 0) {
                setNewProductList([]);
                return;
            }

            setIsFetchingMock(true);

            // ใช้ Map เพื่อเก็บ quantity/description เดิม หากมี (สำหรับรายการที่มีอยู่แล้วในตาราง)
            const existingMap = new Map(newProductList.map((item) => [item.sku, item]));

            const fetchedProducts = await Promise.all(
                inputLines.map(async (inputItem) => {
                    const { sku, fcQuantity } = inputItem;
                    const mockData = await fetchProductMock(sku);
                    const existingItem = existingMap.get(sku);

                    let quantityValue;
                    // ลำดับความสำคัญของ Quantity:
                    if (fcQuantity !== null) {
                        // 1. ใช้ค่าจาก Input ใหม่ล่าสุด (ถ้ามีการระบุ)
                        quantityValue = fcQuantity;
                    } else if (existingItem) {
                        // 2. ใช้ค่าเดิมที่เคยกรอกในตาราง Preview (ถ้ามี)
                        quantityValue = existingItem.quantity;
                   } else {
                        // 3. ใช้ค่าเริ่มต้นจาก Mock Data (ซึ่งคือ 0)
                        quantityValue = mockData.quantity; 
                    }

                    return {
                        sku: sku,
                        productName: mockData.productName,
                        class: mockData.class, 
                        // 🔑 ใช้ quantity ที่คำนวณใหม่
                        quantity: quantityValue,
                        // ใช้ description เดิมถ้ามี
                        description: existingItem ? existingItem.description : mockData.description,
                    };
                })
            );

            // กรองรายการที่ไม่ซ้ำกัน (ถ้ามีรหัสซ้ำ) โดยใช้รายการแรกที่พบ
            const uniqueFetchedProducts = fetchedProducts.filter(
                (item, index, self) => index === self.findIndex((t) => t.sku === item.sku)
            );

            setNewProductList(uniqueFetchedProducts);
            setIsFetchingMock(false);
        };

        // หน่วงเวลาเล็กน้อยเพื่อไม่ให้เรียกบ่อยเกินไปขณะผู้ใช้พิมพ์
        const delayDebounceFn = setTimeout(() => {
            fetchNewProductData();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [productNamesInput]); // ไม่ต้องใส่ newProductList ใน dependency เพราะเราดึงค่าเดิมมาใช้เอง

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

    const resetForm = () => {
        setProductNamesInput("");
        setNewProductList([]);
        setComments("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validEntries = newProductList.filter(
            (item) =>
                item.quantity > 0 &&
                item.productName &&
                !item.productName.includes("**ไม่พบชื่อสินค้า**")
        );

        if (validEntries.length === 0)
            return alert("กรุณาป้อนรหัสสินค้าที่ถูกต้องและระบุจำนวน Forecast มากกว่า 0");
        if (isSubmitting) return;

        setIsSubmitting(true);
        
        // 🔑 เรียก onSubmitProducts เพื่อส่งรายการสินค้าที่ถูกต้องกลับไปยัง KeyFC
        onSubmitProducts(validEntries, comments); 
        
        // จำลองการโหลด
        setTimeout(() => {
            setIsSubmitting(false);
            resetForm();
            setIsModalOpen(false);
        }, 500); 
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#000000ba] z-50 flex justify-center items-center">
            <div className="bg-white h-[90%] w-[75%] max-w-4xl p-6 shadow-2xl z-50 overflow-y-auto rounded-lg">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                    <h1 className="text-2xl font-extrabold text-[#640037]">
                        ป้อนยอด Forecast (FC) หลายรายการ
                    </h1>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-3xl text-gray-500 hover:text-[#640037] transition p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. ส่วนป้อนรหัสสินค้า */}
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <Package className="w-4 h-4 mr-2 text-[#640037]" />
                                **รหัสสินค้าและจำนวน FC (ป้อนรายการละ 1 บรรทัด)***
                            </label>
                            <textarea
                                value={productNamesInput}
                                onChange={(e) => setProductNamesInput(e.target.value)}
                                // 🔑 ปรับตัวอย่างเป็น SKU และจำนวน
                                placeholder="เช่น&#10;09-55555-001 10&#10;09-55555-002 50&#10;"
                                className="w-full p-2 border border-gray-300 rounded-lg h-32"
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* 3. ตารางแสดงตัวอย่างข้อมูล (Preview Table) */}
                    {newProductList.length > 0 && (
                        <div className="border p-4 rounded-lg bg-yellow-50/50">
                            <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                                <Edit2 className="w-4 h-4 mr-2 text-gray-600" />{" "}
                                ตรวจสอบและแก้ไขจำนวน Forecast
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
                                            <th scope="col" className="px-3 py-2 w-24">รหัสสินค้า</th>
                                            <th scope="col" className="px-3 py-2 min-w-[200px]">ชื่อสินค้า</th>
                                            <th scope="col" className="px-3 py-2 w-20">Class</th>
                                            <th scope="col" className="px-3 py-2 w-28">Forecast (หน่วย)*</th>
                                            <th scope="col" className="px-3 py-2 min-w-[250px]">รายละเอียด Description</th>
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
                                                <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{item.sku}</td>
                                                <td className="px-3 py-2">{item.productName}</td>
                                                <td className="px-3 py-2 font-bold text-[#640037]">{item.class}</td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item.sku, e.target.value)}
                                                        className="w-full p-1 border border-gray-300 rounded-lg text-center"
                                                        required
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => handleDescriptionChange(item.sku, e.target.value)}
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

                    <div className="pt-2 border-t flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || newProductList.length === 0 || isFetchingMock || newProductList.some(item => item.productName.includes("**ไม่พบชื่อสินค้า**"))}
                            className="bg-[#640037] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition disabled:opacity-70"
                        >
                            {isSubmitting
                                ? "กำลังบันทึก..."
                                : `บันทึก Forecast (${newProductList.filter(v => !v.productName.includes("**ไม่พบชื่อสินค้า**")).length} รายการ)`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}