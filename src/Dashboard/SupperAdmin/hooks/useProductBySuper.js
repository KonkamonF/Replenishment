import { useState, useEffect } from "react";
import { API_TOKEN } from "../../../config/apiConfig";

export function useProductBySuper({ classType = "manual", className = "A", token = API_TOKEN }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/product/search?page=1&offset=9999&columns=${classType}Class|${className}`,
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
        const allData = json?.result?.data || [];
        setData(allData);
        setTotal(allData.length); // จำนวนทั้งหมดของคลาส
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [classType, className, token]);

  return { data, total, loading, error };
}
