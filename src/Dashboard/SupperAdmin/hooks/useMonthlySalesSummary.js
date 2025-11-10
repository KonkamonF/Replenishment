// src/hooks/useMonthlySalesSummary.js
import { useState, useEffect } from "react";
import { API_BASE_URL, API_TOKEN } from "../../../config/apiConfig";

// Hook ดึงข้อมูลยอดขายรายเดือนจาก API
export function useMonthlySalesSummary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sales/monthly-summary`, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (active) {
          setData(json?.data || []);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
