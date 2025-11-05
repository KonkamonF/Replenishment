import { useState, useEffect, useRef } from "react";

export function useProductByClass({
  classType = "manual",
  className = "A",
  initialPageSize = 50,
  token,
}) {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // เก็บข้อมูลทั้งหมด
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const debounceTimer = useRef(null);

  // โหลดข้อมูลทุกหน้าแค่ครั้งเดียว (cache)
  const fetchAllOnce = async () => {
    setLoading(true);
    setError(null);
    try {
      let all = [];
      let currentPage = 1;
      let keepGoing = true;

      while (keepGoing) {
        const res = await fetch(
          `/api/product/search?page=${currentPage}&offset=${pageSize}&columns=${classType}Class|${className}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const chunk = json?.result?.data || [];
        all = [...all, ...chunk];
        if (chunk.length < pageSize) keepGoing = false;
        currentPage++;
      }

      setAllData(all);
      setTotal(all.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // filter + paginate ฝั่ง React
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
    const paginated = filtered.slice(start, start + pageSize);

    setData(paginated);
    setTotal(filtered.length);
  };

  // โหลดข้อมูลทุกหน้า (ครั้งแรกเท่านั้น)
  useEffect(() => {
    fetchAllOnce();
  }, [classType, className]);

  // debounce ค้นหา / เปลี่ยนหน้า
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
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
