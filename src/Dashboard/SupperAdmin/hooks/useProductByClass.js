import { useState, useEffect, useRef } from "react";
import { API_BASE_URL, API_TOKEN } from "../../../config/apiConfig";

export function useProductByClass({
  classType = "manual",
  className = "A",
  initialPageSize = 50,
  token = API_TOKEN,
}) {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimer = useRef(null);

  // ✅ โหลดข้อมูลทั้งหมดในคลาสเดียว
  const fetchAllOnce = async () => {
    setLoading(true);
    setError(null);

    try {
      let all = [];
      let currentPage = 1;
      let keepGoing = true;

      while (keepGoing) {
        const url = `${API_BASE_URL}/products/query?page=${currentPage}&per_page=${pageSize}&filters=${classType}Class=${className}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const rawData = json?.data || json?.result?.data || [];

        // ✅ Normalize key ให้ชื่อ field เป็นมาตรฐาน
        const normalized = rawData.map((p) => ({
          no: p.no ?? p.No ?? "",
          itemCode: p.itemCode?.trim?.() ?? p.ItemCode?.trim?.() ?? "",
          description: p.description ?? p.Description ?? "",
          section: p.section ?? p.Section ?? "",
          type: p.type ?? p.Type ?? "",
          brand: p.brand ?? p.Brand ?? "",
          manualClass: p.manualClass ?? p.ManualClass ?? "",
          autoClass: p.autoClass ?? p.autoClass ?? "",
          pricePerUnit: p.pricePerUnit ?? p.PricePerUnit ?? 0,
          minPricePerUnit: p.minPricePerUnit ?? p.MinPricePerUnit ?? 0,
          stockAllStore: p.stockAllStore ?? p.StockAllStore ?? 0,
          leadTime: p.leadTime ?? p.LeadTime ?? 0,
        }));

        all = [...all, ...normalized];

        // ✅ ถ้าข้อมูลที่ดึงมาน้อยกว่า pageSize ให้หยุดโหลด
        if (rawData.length < pageSize) keepGoing = false;
        else currentPage++;
      }

      setAllData(all);
      setTotal(all.length);
      setData(all.slice(0, pageSize)); // แสดงหน้าแรก
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ฟังก์ชันกรองข้อมูลเมื่อมีการค้นหา
  const applyFilter = () => {
    let filtered = allData;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = allData.filter(
        (p) =>
          p.description?.toLowerCase().includes(q) ||
          p.itemCode?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    const start = (page - 1) * pageSize;
    setData(filtered.slice(start, start + pageSize));
    setTotal(filtered.length);
  };

  // ✅ โหลดข้อมูลเมื่อเปลี่ยน classType / className
  useEffect(() => {
    fetchAllOnce();
  }, [classType, className]);

  // ✅ debounce การค้นหา
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (searchTerm.trim()) setPage(1);
      applyFilter();
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, page, pageSize, allData]);

  return {
    data,
    total,
    page,
    pageSize,
    loading,
    error,
    searchTerm,
    setPage,
    setPageSize,
    setSearchTerm,
  };
}
