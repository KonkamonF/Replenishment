import { useState, useEffect, useRef } from "react";

export function useProductByClass({
  classType = "manual",   // manual | auto
  className = "A",        // A | B | C | N
  initialPageSize = 50,
  token,
  fetchAllOnSearch = true, // เปิดโหมดค้นหาทั่วทุกหน้า
}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const debounceTimer = useRef(null);
  const abortController = useRef(null);

  // ฟังก์ชันโหลดข้อมูล 1 หน้า
  const fetchPage = async (pageNum) => {
    const url = `/api/product/search?page=${pageNum}&offset=${pageSize}&columns=${classType}Class|${className}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json?.result?.data || [];
  };

  // โหลดข้อมูลทั้งหมดถ้ามีการค้นหา
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      let all = [];
      let currentPage = 1;
      let keepGoing = true;

      while (keepGoing) {
        const chunk = await fetchPage(currentPage);
        all = [...all, ...chunk];
        if (chunk.length < pageSize) keepGoing = false;
        currentPage++;
      }

      // filter ฝั่ง React
      const filtered = all.filter(
        (p) =>
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setTotal(filtered.length);
      setData(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // โหลดเฉพาะหน้าเดียว (ไม่มี search)
  const fetchPagedData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPage(page);
      setData(res);
      setTotal(res.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ดักทุกครั้งที่ page หรือ search เปลี่ยน
  useEffect(() => {
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (fetchAllOnSearch && searchTerm.trim()) {
        fetchAllData(); // โหลดทุกหน้า + filter ใน React
      } else {
        fetchPagedData(); // โหลดเฉพาะหน้าเดียว (เร็ว)
      }
    }, 500);

    return () => clearTimeout(debounceTimer.current);
  }, [page, pageSize, searchTerm, classType, className]);

  return {
    data,
    total,
    page,
    pageSize,
    loading,
    error,
    searchTerm,
    sortField,
    sortOrder,
    setPage,
    setPageSize,
    setSearchTerm,
    setSortField,
    setSortOrder,
  };
}
