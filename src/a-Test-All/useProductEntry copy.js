import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL, API_TOKEN } from "../../../config/apiConfig";

/**
 * useProductEntry Hook — สำหรับจัดการข้อมูลสินค้าที่จะเข้าคลัง
 * ครอบคลุม: ดึงข้อมูลรายวัน / เพิ่ม / ลบ / แก้ไข / สรุป
 */

export function useProductEntry() {
  const [data, setData] = useState([]);               // รายการสินค้าของวันนั้น
  const [summary, setSummary] = useState(null);       // ข้อมูลสรุป
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = API_TOKEN;
  // ---------------------------------------------------------
  // 📍 1. ดึงข้อมูลสินค้าตามวันที่ (ใช้ตอนคลิกวันในปฏิทิน)
  // ---------------------------------------------------------
  const fetchByDate = useCallback(async (date) => {
    if (!date) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/product-entry/by-date?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.detail || "โหลดข้อมูลไม่สำเร็จ");
      setData(json.entries || []);
    } catch (err) {
      console.error(" Fetch by date error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ---------------------------------------------------------
  // 📍 2. ดึงข้อมูลสรุปทั้งหมด (ใช้ใน Dashboard หรือปุ่มรวม)
  // ---------------------------------------------------------
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/product-entry/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "โหลด summary ไม่สำเร็จ");
      setSummary(json);
    } catch (err) {
      console.error(" Summary error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ---------------------------------------------------------
  // 📍 3. เพิ่มข้อมูลสินค้าใหม่ (พร้อมรูปภาพ)
  // ---------------------------------------------------------
  const addEntry = useCallback(
    async ({
      productName,
      poNumber,
      quantity,
      supplier,
      comments,
      entryDate,
      images = [],
    }) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("poNumber", poNumber || "");
        formData.append("quantity", quantity);
        formData.append("supplier", supplier || "");
        formData.append("comments", comments || "");
        formData.append("entryDate", entryDate);
        images.forEach((f) => formData.append("images", f));

        const res = await fetch(`${API_BASE_URL}/product-entry/add`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || "เพิ่มข้อมูลไม่สำเร็จ");

        await fetchByDate(entryDate); // โหลดข้อมูลใหม่ทันที
        return json;
      } catch (err) {
        console.error(" Add Entry Error:", err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchByDate]
  );

  // ---------------------------------------------------------
  // 📍 4. ลบข้อมูลตาม ID
  // ---------------------------------------------------------
  const deleteEntry = useCallback(
    async (id, entryDate) => {
      if (!id) return;
      if (!window.confirm("ต้องการลบข้อมูลนี้จริงหรือไม่?")) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/product-entry/delete?id=${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || "ลบข้อมูลไม่สำเร็จ");
        await fetchByDate(entryDate);
        return json;
      } catch (err) {
        console.error(" Delete Entry Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [token, fetchByDate]
  );

  // ---------------------------------------------------------
  // 📍 5. แก้ไขข้อมูล (update)
  // ---------------------------------------------------------
  const updateEntry = useCallback(
    async ({
      id,
      productName,
      poNumber,
      quantity,
      supplier,
      comments,
      entryDate,
      keepImages = [],
      newImages = [],
    }) => {
      if (!id) throw new Error("ไม่พบ ID สำหรับแก้ไข");

      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("productName", productName || "");
        formData.append("poNumber", poNumber || "");
        formData.append("quantity", quantity || 0);
        formData.append("supplier", supplier || "");
        formData.append("comments", comments || "");
        formData.append("entryDate", entryDate || "");
        formData.append("keepImages", keepImages.join("|"));
        newImages.forEach((f) => formData.append("newImages", f));

        const res = await fetch(`${API_BASE_URL}/product-entry/update`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || "อัปเดตข้อมูลไม่สำเร็จ");

        await fetchByDate(entryDate);
        return json;
      } catch (err) {
        console.error(" Update Entry Error:", err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchByDate]
  );

  // ---------------------------------------------------------
  // 🧭 ส่งออกค่าจาก Hook
  // ---------------------------------------------------------
  return {
    data,           // ข้อมูลสินค้าของวันนั้น
    summary,        // ข้อมูลสรุป
    loading,
    error,
    fetchByDate,    // ดึงข้อมูลตามวันที่
    fetchSummary,   // ดึงข้อมูลสรุปทั้งหมด
    addEntry,       // เพิ่มข้อมูลใหม่
    updateEntry,    // แก้ไขข้อมูล
    deleteEntry,    // ลบข้อมูล
  };
}
