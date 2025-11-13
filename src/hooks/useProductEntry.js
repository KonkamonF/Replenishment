import { useState, useCallback } from "react";
import { API_BASE_URL, API_TOKEN } from "../config/apiConfig.js";

/**
 * useProductEntry Hook — จัดการข้อมูลสินค้าจะเข้าคลัง
 * เพิ่มความสามารถ:
 *  - prefetchMonth(year, month0) : ดึงข้อมูลทั้งเดือน (month0 = index 0..11)
 *  - monthEntries : รายการของทั้งเดือนสำหรับเรนเดอร์ปฏิทิน
 *  - toggleStatus : พยายามเรียก /status ถ้ามี; ถ้าไม่มี fallback ไป /update
 */
export function useProductEntry() {
  const [data, setData] = useState([]);            // รายการของ "วันที่เลือก"
  const [monthEntries, setMonthEntries] = useState([]); //  รายการของ "ทั้งเดือน"
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = API_TOKEN;

  // ดึงข้อมูลรายวัน (ใช้ตอนกดวันเพื่อเปิด modal)
  const fetchByDate = useCallback(
    async (date) => {
      if (!date) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/product-entry/by-date?date=${date}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "1",
          }

        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || "โหลดข้อมูลไม่สำเร็จ");
        // API สมมติคืน { entries: [...] }
        setData(json.entries || []);
        return json.entries || [];
      } catch (err) {
        console.error(" Fetch by date error:", err);
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // ดึง summary (เผื่อคุณมี API ตัวนี้อยู่แล้ว)
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/product-entry/summary`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "1",
          }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "โหลด summary ไม่สำเร็จ");
      setSummary(json);
      // ถ้า API นี้มี entries ทั้งเดือน ก็อัปเดต monthEntries ให้ด้วย
      if (Array.isArray(json.entries)) setMonthEntries(json.entries);
    } catch (err) {
      console.error(" Summary error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  //  ดึงข้อมูลทั้งเดือนด้วยการเรียก by-date ทีละวัน (ไม่ต้องแก้ API)
  // const prefetchMonth = useCallback(
  //   async (year, monthZeroBased) => {
  //     // monthZeroBased: 0..11
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const first = new Date(year, monthZeroBased, 1);
  //       const last = new Date(year, monthZeroBased + 1, 0);
  //       const days = last.getDate();

  //       const all = [];
  //       for (let d = 1; d <= days; d++) {
  //         const dateStr = `${year}-${String(monthZeroBased + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  //         const entries = await fetchByDate(dateStr); // ใช้ API เดิม
  //         if (Array.isArray(entries) && entries.length) {
  //           // ใส่ entryDate ให้แน่ใจทุกแถว
  //           entries.forEach((e) => {
  //             all.push({ ...e, entryDate: e.entryDate || dateStr });
  //           });
  //         }
  //       }
  //       setMonthEntries(all);
  //     } catch (err) {
  //       console.error(" Prefetch month error:", err);
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [fetchByDate]
  // );
  const prefetchMonth = useCallback(async (year, monthZeroBased) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/product-entry/by-month?year=${year}&month=${monthZeroBased + 1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "1",
          }
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "โหลดข้อมูลเดือนล้มเหลว");

      //  เซ็ตข้อมูลทั้งหมดของเดือนนี้
      setMonthEntries((json.entries || []).filter(x => x.id));

    } catch (err) {
      console.error(" Prefetch month error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // เพิ่มข้อมูลใหม่ (ใส่ status เริ่มต้นเป็น F)
  const addEntry = useCallback(
    async ({ productName, poNumber, quantity, supplier, comments, entryDate, images = [], status = "F" }) => {
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
        formData.append("status", status);
        images.forEach((f) => formData.append("images", f));

        const res = await fetch(`${API_BASE_URL}/product-entry/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "1",
          },
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || "เพิ่มข้อมูลไม่สำเร็จ");

        // รีโหลดวันที่นั้น
        await fetchByDate(entryDate);
        // อัปเดต monthEntries เฉพาะวันที่นั้น (insert เข้าของเดิม)
        // setMonthEntries((prev) => [...prev, ...(json.entries || [{ ...json, entryDate, status }])]);
        if (json.entry) {
          setMonthEntries((prev) => [...prev, json.entry]);
        }
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

  // ลบข้อมูล
  const deleteEntry = useCallback(
    async (id, entryDate) => {
      if (!id) return;
      if (!window.confirm("ต้องการลบข้อมูลนี้จริงหรือไม่?")) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/product-entry/delete?id=${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "1",
          },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || "ลบข้อมูลไม่สำเร็จ");
        await fetchByDate(entryDate);
        // ตัดออกจาก monthEntries ด้วย
        setMonthEntries((prev) => prev.filter((x) => x.id !== id));
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

  // อัปเดตข้อมูล (รองรับส่ง status มาด้วย)
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
      status, //  ถ้ามีจะส่งไปด้วย
    }) => {
      if (!id) throw new Error("ไม่พบ ID สำหรับแก้ไข");
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("id", id);
        if (productName !== undefined) formData.append("productName", productName || "");
        if (poNumber !== undefined) formData.append("poNumber", poNumber || "");
        if (quantity !== undefined) formData.append("quantity", quantity || 0);
        if (supplier !== undefined) formData.append("supplier", supplier || "");
        if (comments !== undefined) formData.append("comments", comments || "");
        if (entryDate !== undefined) formData.append("entryDate", entryDate || "");
        if (status !== undefined) formData.append("status", status);
        formData.append("keepImages", (keepImages || []).join("|"));
        (newImages || []).forEach((f) => formData.append("newImages", f));

        const res = await fetch(`${API_BASE_URL}/product-entry/update`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "1",
          },
          body: formData,
        });

        const json = await res.json();
        if (!res.ok) {
          console.error("UPDATE ERROR:", json);
          throw new Error(json.detail || JSON.stringify(json) || "อัปเดตข้อมูลไม่สำเร็จ");
        }

        await fetchByDate(entryDate);
        // sync monthEntries
        setMonthEntries((prev) =>
          prev.map((x) => (x.id === id ? { ...x, productName, poNumber, quantity, supplier, comments, status } : x))
        );
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

  //  Toggle สถานะ (PATCH ไปที่ /product-entry/status)
  const toggleStatus = useCallback(
    async (id, currentStatus, entryDate) => {
      try {
        const nextStatus = currentStatus === "T" ? "F" : "T";
        const form = new FormData();
        form.append("id", id);
        form.append("status", nextStatus);

        const res = await fetch(`${API_BASE_URL}/product-entry/status`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "ngrok-skip-browser-warning": "1",
          },
          body: form,
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || "อัปเดตสถานะไม่สำเร็จ");

        // อัปเดตใน monthEntries (ฝั่ง client นี้)
        setMonthEntries((prev) =>
          prev.map((x) => (x.id === id ? { ...x, status: nextStatus } : x))
        );

        if (entryDate) {
          await fetchByDate(entryDate); // โหลดรายการของวันใน modal ใหม่
        }
        return json;
        } catch (err) {
        console.error(" Toggle Status Error:", err);
        setError(err.message);
        throw err;
      }
    },
    [token, fetchByDate]
  );

  return {
    data,            // รายการของวัน (เปิด modal)
    monthEntries,    //  รายการทั้งเดือน (เรนเดอร์ปฏิทิน)
    summary,
    loading,
    error,
    fetchByDate,
    fetchSummary,
    prefetchMonth,   //  ใช้ preload ทั้งเดือน
    addEntry,
    updateEntry,
    deleteEntry,
    toggleStatus,
    setMonthEntries,
  };
}
