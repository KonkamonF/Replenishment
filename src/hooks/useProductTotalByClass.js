import { useState, useEffect } from "react";
import { API_BASE_URL, API_TOKEN } from "../config/apiConfig.js";
//  เก็บ cache และสถานะการโหลด (global-level)
let cachedTotals = null;
let loadingPromise = null;

export function useProductTotalByClass({ className = "A", classType = "manual" }) {
  const [totals, setTotals] = useState(cachedTotals);
  const [loading, setLoading] = useState(!cachedTotals);
  const [error, setError] = useState(null);
  const token = API_TOKEN;

  useEffect(() => {
    let active = true;

    // ถ้ามี cache แล้ว ไม่ต้องโหลดอีก
    if (cachedTotals) {
      setTotals(cachedTotals);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // ถ้ามี Promise จากการโหลดก่อนหน้า => รอให้มันเสร็จ
        if (loadingPromise) {
          const data = await loadingPromise;
          if (active) setTotals(data);
          return;
        }

        // เริ่มโหลดใหม่
        const url = `${API_BASE_URL}/count/parameter?groupBy=${classType}Class`;
        loadingPromise = fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "1",
          },
        })
          .then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();

            const data = json?.data || json?.result?.data || [];
            const totalsMap = {};

            data.forEach((item) => {
              const key =
                item.manualClass ||
                item.manualclass ||
                item.autoClass ||
                item.autoclass ||
                item.MANUALCLASS ||
                item.AUTOCLASS;
              const count = Number(item.count ?? item.COUNT ?? 0);
              if (key) totalsMap[key] = count;
            });

            cachedTotals = totalsMap;
            return totalsMap;
          })
          .finally(() => {
            loadingPromise = null;
          });

        const result = await loadingPromise;
        if (active) setTotals(result);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [classType]);

  return { total: totals?.[className] ?? 0, totals, loading, error };
}
