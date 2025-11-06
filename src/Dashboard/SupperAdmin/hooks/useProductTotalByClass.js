import { useState, useEffect } from "react";
import { API_TOKEN } from "../../../config/apiConfig";

// ✅ Hook สำหรับดึง "จำนวนทั้งหมด" ของ Class โดยไม่ต้องแบ่งหน้า
export function useProductTotalByClass({
  classType = "manual",
  className = "A",
  token = API_TOKEN,
}) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotal = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
        `/api/product/search?page=1&offset=500&columns=${classType}Class|${className}`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            },
        }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // ✅ ดึงจำนวนทั้งหมด (ถ้ามี result.data)
        const all = json?.result?.data || [];
        setTotal(all.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, [classType, className, token]);

  return { total, loading, error };
}
