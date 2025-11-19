import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Eye, EyeOff, ChevronDown } from "lucide-react";
import StockShowModal from "../SideBar-Modal/StockModal/StockShow.jsx";
import CommunicationCard from "../SideBar-Modal/StockModal/CommunicateCard.jsx";
import { useTradeProducts } from "../hooks/useTradeProducts.js";

// --- Helpers ---
const safeNum = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeText = (v) => {
  if (v === null || v === undefined || v === "") return "NDB";
  return v;
};

const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || num === "") return "-";
  const n = Number(num);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
};

const getDOHStyle = (doh) => {
  if (doh === null || doh === undefined) return "text-gray-500";
  if (doh > 365) return "text-red-600 font-extrabold bg-red-50";
  if (doh > 180) return "text-orange-600 font-bold";
  return "text-green-600 font-bold";
};

// Overflow style by score
const getOverflowStyle = (score) => {
  if (score === null || score === undefined) return "text-gray-500";
  if (score > 100) return "text-red-600 font-extrabold";
  if (score > 50) return "text-orange-600 font-bold";
  return "text-green-600 font-semibold";
};

const getSaleInAgingTier = (item) => {
  // ใช้ค่าจาก API โดยตรง รองรับทั้ง saleInAgingTier และ SaleInAgingTier
  return item.saleInAgingTier ?? item.SaleInAgingTier ?? "-";
};

const getSaleInAgingTierStyle = (tier) => {
  switch ((tier || "").toLowerCase()) {
    case "fast":
      return "bg-green-100 text-green-800 border-green-300";
    case "normal":
      return "bg-sky-100 text-sky-800 border-sky-300";
    case "slow":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "very slow":
      return "bg-red-100 text-red-800 border-red-300";
    case "no stock":
      return "bg-gray-300 text-gray-800 border-gray-400";
    case "no aging":
      return "bg-gray-100 text-gray-500 border-gray-300";
    default:
      return "bg-gray-200 text-gray-700 border-gray-300";
  }
};

// --- Columns ---
const ALL_COLUMNS = [
  { key: "No", name: "No.", isAlwaysVisible: true },
  { key: "Code", name: "ItemCode / Brand", isAlwaysVisible: true },
  { key: "Description", name: "Description / Class", isAlwaysVisible: true },
  { key: "Best", name: "Best/BestSet", isAlwaysVisible: false },
  { key: "Forecast", name: "ยอด Forecast", isAlwaysVisible: false },
  { key: "Actual", name: "ยอด Actual", isAlwaysVisible: false },
  { key: "Target", name: "Target Now", isAlwaysVisible: false },
  { key: "TargetLast", name: "Target Last Mount", isAlwaysVisible: false },

  { key: "DOH", name: "DOH (วัน)", isAlwaysVisible: false },
  { key: "POH", name: "PO on Hand", isAlwaysVisible: false },
  { key: "SetType", name: "ชุด Set / แตก Set", isAlwaysVisible: false },
  { key: "Stock_Physical", name: "Stock (กายภาพ)", isAlwaysVisible: false },
  { key: "Stock_Show", name: "Stock (ตัวโชว์)", isAlwaysVisible: false },
  { key: "Stock", name: "Stock หักจอง", isAlwaysVisible: false },
  { key: "Stock_Cl", name: "Stock Clearance", isAlwaysVisible: false },
  { key: "Alloc_Current", name: "ตัดจ่ายปัจจุบัน", isAlwaysVisible: false },
  { key: "Alloc_3M", name: "ตัดจ่ายย้อนหลัง 3 เดือน", isAlwaysVisible: false },
  { key: "Alloc_6M", name: "ตัดจ่ายย้อนหลัง 6 เดือน", isAlwaysVisible: false },
  { key: "OverflowScore", name: "Overflow Score (%)", isAlwaysVisible: false },
  { key: "SaleInAgingTier", name: "SaleInAgingTier", isAlwaysVisible: false },
  {
    key: "SuggestionPurchasing",
    name: "SuggestionPurchasing",
    isAlwaysVisible: false,
  },
  { key: "TradeStatus", name: "สถานะ Trade", isAlwaysVisible: false },
  { key: "TradeRemark", name: "Remark Trade / Action", isAlwaysVisible: false },
  { key: "InterTrade", name: "InterTrade Owner", isAlwaysVisible: false },
];

// --- Column Toggle Dropdown ---
function ColumnToggleDropdown({ hiddenColumns, toggleColumnVisibility }) {
  const toggleableColumns = ALL_COLUMNS.filter((c) => !c.isAlwaysVisible);
  const hasHiddenColumns = hiddenColumns.length > 0;
  const hiddenCount = hiddenColumns.length;
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div className="relative inline-block text-left z-10" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`inline-flex justify-center items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 shadow-md ${
          hasHiddenColumns
            ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
            : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
        }`}
        aria-expanded={open}
      >
        {open || hasHiddenColumns ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
        {`Show/Hide Columns ${hiddenCount > 0 ? `(${hiddenCount})` : ""}`}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {open && (
        <div
          id="column-menu"
          className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-2xl bg-white ring-1 ring-pink-800 ring-opacity-20 focus:outline-none z-50"
        >
          <div className="p-2 max-h-60 overflow-y-auto">
            <p className="px-3 py-1 text-xs text-gray-500 font-bold border-b mb-1">
              Toggleable Columns
            </p>
            {toggleableColumns.map((col) => (
              <div
                key={col.key}
                onClick={() => toggleColumnVisibility(col.key)}
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-pink-100 cursor-pointer transition duration-100 rounded-md"
              >
                <span className="font-medium">{col.name}</span>
                {hiddenColumns.includes(col.key) ? (
                  <EyeOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Eye className="w-4 h-4 text-green-500" />
                )}
              </div>
            ))}
            <div className="px-3 py-2 text-xs text-gray-400 border-t mt-2">
              คอลัมน์ ItemCode และ Description ถูกตั้งค่าให้แสดงเสมอ
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export default function TradeAdmin() {
  // ---------- State ต่าง ๆ ----------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isStockShow, setIsStockShow] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    brand: "All",
    class: "All",
    best2025: "All",
    tradeStatus: "All",
    set: "All",
  });

  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [modalData, setModalData] = useState({
    comment: "",
    newStatus: "Pending",
  });
  const CURRENT_USER = "Trade Planner (Key)";

  //  Pagination state (ใช้กับ API)
  const [pageSize, setPageSize] = useState(20); // 10 / 20 / 50
  const [currentPage, setCurrentPage] = useState(1);

  // ---------- ใช้ hook ดึงข้อมูลจาก API (server-side pagination) ----------
  const {
    data,
    loading,
    error,
    totalPages,
    totalItems,
    updateTradeStatus,
    fullData,
    loadFullData,
  } = useTradeProducts({
    page: currentPage,
    perPage: pageSize,
    filters,
  });

  const handleChangeTradeStatus = (item, newStatus) => {
    updateTradeStatus(item.Code, newStatus);
  };

  const getStatusStyleLocal = (status) => {
    if (status === "Abnormal") {
      return "bg-red-100 text-red-800 border-red-300"; // สีแดง
    }
    if (status === "Normal") {
      return "bg-green-100 text-green-800 border-green-300"; // สีเขียว
    }
    // สีเทาสำหรับสถานะอื่นๆ (ถ้ามี)
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  const toggleColumnVisibility = (key) =>
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  const isColumnHidden = (key) => hiddenColumns.includes(key);

  const handleFilterChange = (name, value) => {
    setFilters((p) => ({ ...p, [name]: value }));
    // ทุกครั้งที่เปลี่ยน filter → กลับไปหน้าแรก
    setCurrentPage(1);
  };

  // ---------- Unique options (จาก data ใน page ปัจจุบัน) ----------
  const uniqueBrands = useMemo(
    () => ["All", ...new Set(data.map((d) => d.Brand))],
    [data]
  );
  const uniqueClasses = ["All", "A", "B", "C", "D", "MD", "N"];

  const uniqueBest2025 = useMemo(() => ["All", "Yes", ""], []);
  const uniqueTradeStatus = useMemo(
    () => ["All", ...new Set(data.map((d) => d.สถานะTrade))],
    [data]
  );
  const uniqueSets = useMemo(
    () => ["All", ...new Set(data.map((d) => d.Type))],
    [data]
  );

  // ---------- Filter ฝั่ง UI (กรองจาก fullData ที่ Server ส่งมา) ----------
  const filteredData = useMemo(() => {
    // ⭐️ 1. เปลี่ยนเป้าหมายการกรองเป็น fullData
    return fullData.filter((item) => {
      const s = filters.search.trim().toLowerCase();
      const bestValue = item.YN_Best_2025 || "";

      const code = (item.Code || "").toLowerCase();
      const desc = (item.Description || item.description || "").toLowerCase();
      const remark = (item.RemarkTrade || "").toLowerCase();
      const brand = (item.Brand || "").toLowerCase();

      const matchesSearch =
        !s ||
        code.includes(s) ||
        desc.includes(s) ||
        remark.includes(s) ||
        brand.includes(s);

      const matchesBrand =
        filters.brand === "All" || item.Brand === filters.brand;

      const matchesClass =
        filters.class === "All" || item.Class === filters.class;

      const matchesBest2025 =
        filters.best2025 === "All" || filters.best2025 === bestValue;

      const matchesTradeStatus =
        filters.tradeStatus === "All" ||
        item.สถานะTrade === filters.tradeStatus;

      const matchesSet = filters.set === "All" || item.Type === filters.set;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesClass &&
        matchesBest2025 &&
        matchesTradeStatus &&
        matchesSet
      );
    }); // ⭐️ 2. เปลี่ยน Dependency เป็น fullData
  }, [filters, fullData]);

  // ---------- ⭐️ 3. คำนวณข้อมูลสำหรับแสดงผลในหน้านี้ (Client-side Pagination) ----------
  const totalFilteredItems = filteredData.length;
  // ⭐️ 4. คำนวณจำนวนหน้าทั้งหมดใหม่ โดยอิงจากข้อมูลที่กรองแล้ว
  const totalClientPages = Math.ceil(totalFilteredItems / pageSize) || 1; // ⭐️ 5. (สำคัญ) ตรวจสอบว่าหน้าปัจจุบันไม่เกินจำนวนหน้าทั้งหมด (กรณีข้อมูลหดเหลือน้อย)

  useEffect(() => {
    if (currentPage > totalClientPages && totalClientPages > 0) {
      setCurrentPage(totalClientPages);
    }
    // ถ้า totalClientPages เป็น 1 (เช่น ไม่มีข้อมูล) ให้เด้งกลับไปหน้า 1
    else if (currentPage !== 1 && totalClientPages === 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalClientPages]);

  // ⭐️ 6. สร้างตัวแปรใหม่สำหรับ .map ในตาราง
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // ถ้า totalPages จาก API เปลี่ยน แล้ว currentPage เกิน ให้ดึงกลับมา
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    loadFullData(filters);
  }, [filters]);

  const getTargetNow = (item) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const key = `targetSale_${year}_${month}`;
    return item[key] ?? "-";
  };

  const getTargetLast = (item) => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();

    if (month <= 0) {
      year -= 1;
      month = 12;
    }

    const mm = String(month).padStart(2, "0");
    const key = `targetSale_${year}_${mm}`;
    return item[key] ?? "-";
  };

  // --- Allocation helpers (Dynamic) ---
  const calcAlloc3M = (item) => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1; // 1–12

    const keys = [];
    for (let i = 0; i < 3; i++) {
      let newYear = year;
      let newMonth = month - i;

      if (newMonth <= 0) {
        newYear = year - 1;
        newMonth = 12 + newMonth;
      }

      const key = `cutoffMonth_${newYear}_${String(newMonth).padStart(2, "0")}`;
      keys.push(key);
    }

    let total = 0;
    keys.forEach((k) => {
      if (item[k] !== undefined && item[k] !== null) {
        total += safeNum(item[k]);
      }
    });

    return total;
  };

  const getActual = (item) => {
    const now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, "0");

    const key = `saleOut_${year}_${month}`;
    return item[key] ?? "-";
  };

  const calcAllocCurrent = (item) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const key = `cutoffMonth_${year}_${month}`;
    return safeNum(item[key]);
  };

  const calcAlloc6M = (item) => {
    return calcAlloc3M(item) * 2;
  };

  const calcOverflowScore = (item) => {
    const stock = safeNum(item.Stock_จบเหลือจริง);
    const alloc3 = calcAlloc3M(item);

    if (!alloc3 || alloc3 === 0) return null;

    const score = ((stock - alloc3) / alloc3) * 100;
    return Math.round(score);
  };

  // Modal handlers
  const openTradeModal = (item) => {
    setSelectedItem(item);
    setModalData({ comment: "", newStatus: item.สถานะTrade || "Pending" });
    setIsModalOpen(true);
  };
  const closeTradeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalData({ comment: "", newStatus: "Pending" });
  };
  const handleModalDataChange = (name, value) =>
    setModalData((p) => ({ ...p, [name]: value }));
  const handleSubmitAction = () => {
    if (!selectedItem || !modalData.comment.trim()) {
      console.error("กรุณาเพิ่มข้อความ Remark ก่อนทำการบันทึก Action");
      return;
    }
    const newRemark = {
      key: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      user: CURRENT_USER,
      status: modalData.newStatus,
      text: modalData.comment.trim(),
    };
    const updated = data.map((it) =>
      it.Code === selectedItem.Code
        ? {
            ...it,
            สถานะTrade: modalData.newStatus,
            RemarkTrade: modalData.comment.trim(),
            KeyRemarks: [...(it.KeyRemarks || []), newRemark],
          }
        : it
    );
    console.log("Updated Trade Data (local only):", updated);
    closeTradeModal();
  };

  const handleShowStockModal = (item) => {
    setSelectedItem(item);
    setIsStockShow(true);
  };

  // summary (จากข้อมูลในหน้าปัจจุบันที่ผ่าน filter แล้ว)
  const totalStock = fullData.reduce(
    (s, it) => s + safeNum(it.Stock_จบเหลือจริง),
    0
  );
  const totalStockWeightedDOH = fullData.reduce(
    (s, it) =>
      s + safeNum(it.Stock_จบเหลือจริง) * safeNum(it.DayOnHand_DOH_Stock2),
    0
  );
  const avgDOH = totalStock > 0 ? totalStockWeightedDOH / totalStock : 0;
  const abnormalCount = fullData.filter(
    (it) => it.สถานะTrade === "Abnormal"
  ).length;

  const totalAllocCurrent = fullData.reduce(
    (s, it) => s + calcAllocCurrent(it),
    0
  );
  const totalAlloc3M = fullData.reduce((s, it) => s + calcAlloc3M(it), 0);
  const totalAlloc6M = fullData.reduce((s, it) => s + calcAlloc6M(it), 0);
  const overflowScores = fullData
    .map((it) => calcOverflowScore(it))
    .filter((v) => v !== null && !isNaN(v));
  const overflowCount = overflowScores.filter((v) => v > 100).length;
  const avgOverflowScore = overflowScores.length
    ? Math.round(
        overflowScores.reduce((a, b) => a + b, 0) / overflowScores.length
      )
    : 0;

  const visibleColumnCount = ALL_COLUMNS.filter(
    (col) => !isColumnHidden(col.key)
  ).length;

  const colClass = (key, base = "") =>
    isColumnHidden(key) ? `hidden ${base}` : base;

  // ... (ต่อจาก getSaleInAgingTierStyle)

  const getClassStyle = (itemClass) => {
    switch (itemClass) {
      case "A":
        return "bg-orange-500";
      case "B":
        return "bg-blue-500";
      case "C":
        return "bg-[#FF894F]";
      case "D":
        return "bg-sky-500";
      case "MD":
        return "bg-purple-500";
      case "N":
        return "bg-[#78C841]";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen">
      {isStockShow && (
        <StockShowModal
          setIsStockShow={setIsStockShow}
          selectedItem={selectedItem}
        />
      )}
      <div className="p-8 bg-white shadow-2xl rounded-xl">
        {/* แสดงสถานะโหลด/ผิดพลาดแบบไม่เปลี่ยน layout หลัก */}
        {loading || error ? (
          <div className="py-10 text-center text-lg text-gray-500">
            {loading ? "กำลังโหลดข้อมูล..." : `เกิดข้อผิดพลาด: ${error}`}
          </div>
        ) : (
          <>
            <header className="mb-6 border-b pb-4">
              <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
                Inventory & Trade Monitor
              </h1>
              <p className="text-gray-500">
                ข้อมูลคงคลัง (Stock) และยอดขาย (Sale Out)
                พร้อมช่องทางการบันทึกและติดตาม Action/Communication
              </p>
            </header>

            {/* --- Key Metrics (Condensed Summary) --- */}
            <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-6">
              <div className="bg-pink-50 p-4 rounded-lg shadow-inner">
                <p className="text-sm text-pink-600 font-semibold">
                  Total SKUs
                </p>
                <p className="text-2xl font-extrabold text-[#640037]">
                  {formatNumber(filteredData.length)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="text-sm text-blue-600 font-semibold">
                  Total Stock
                </p>
                <p className="text-2xl font-extrabold">
                  {formatNumber(totalStock)}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg shadow-inner">
                <p className="text-sm text-yellow-600 font-semibold">
                  Avg. DOH (Weighted)
                </p>
                <p className="text-2xl font-extrabold">
                  {formatNumber(avgDOH, 0)} วัน
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg shadow-inner">
                <p className="text-sm text-red-600 font-semibold">
                  Abnormal Count
                </p>
                <p className="text-2xl font-extrabold">
                  {formatNumber(abnormalCount)}
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded-lg shadow-inner col-span-2 md:col-span-2">
                <p className="text-xs text-green-700 font-semibold">
                  Total Alloc Current
                </p>
                <p className="text-lg font-extrabold text-green-800">
                  {formatNumber(totalAllocCurrent)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  รวมตัดจ่ายปัจจุบันของรายการที่แสดง
                </p>
              </div>

              <div className="bg-sky-50 p-3 rounded-lg shadow-inner">
                <p className="text-xs text-sky-700 font-semibold">Total 3M</p>
                <p className="text-lg font-extrabold text-sky-800">
                  {formatNumber(totalAlloc3M)}
                </p>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg shadow-inner">
                <p className="text-xs text-orange-700 font-semibold">
                  Total 6M
                </p>
                <p className="text-lg font-extrabold text-orange-800">
                  {formatNumber(totalAlloc6M)}
                </p>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg shadow-inner hidden lg:block">
                <p className="text-xs text-purple-700 font-semibold">
                  Overflow Count (&gt;100%)
                </p>
                <p className="text-lg font-extrabold text-purple-800">
                  {formatNumber(overflowCount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  จำนวนรายการที่ Stock มากกว่า 3M alloc 100%
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg shadow-inner hidden lg:block">
                <p className="text-xs text-gray-700 font-semibold">
                  Avg Overflow Score
                </p>
                <p className="text-lg font-extrabold text-gray-800">
                  {formatNumber(avgOverflowScore)}%
                </p>
              </div>
            </div>

            {/* --- Filters --- */}
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-4 items-end p-4 bg-pink-50 rounded-lg border border-pink-200">
              <div className="col-span-2 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  ค้นหาสินค้า (Code/Desc/Remark)
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="ค้นหา..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="w-full p-2 pl-9 pr-8 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  {filters.search && (
                    <button
                      onClick={() => handleFilterChange("search", "")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 hover:text-red-500 font-bold p-1 leading-none"
                      title="ล้างการค้นหา"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white"
                >
                  {uniqueBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Class
                </label>
                <select
                  value={filters.class}
                  onChange={(e) => handleFilterChange("class", e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white"
                >
                  {uniqueClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  YN Best 2025
                </label>
                <select
                  value={filters.best2025}
                  onChange={(e) =>
                    handleFilterChange("best2025", e.target.value)
                  }
                  className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white"
                >
                  {uniqueBest2025.map((o) => (
                    <option key={o} value={o}>
                      {o === "" ? "(Blank)" : o}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  สถานะ Trade
                </label>
                <select
                  value={filters.tradeStatus}
                  onChange={(e) =>
                    handleFilterChange("tradeStatus", e.target.value)
                  }
                  className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white"
                >
                  {uniqueTradeStatus.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ชุด Set / แตก Set
                </label>
                <select
                  value={filters.set}
                  onChange={(e) => handleFilterChange("set", e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white"
                >
                  {uniqueSets.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600 font-medium">
                แสดงผล
                <strong> {formatNumber(paginatedData.length)} </strong>        
                        รายการ จากทั้งหมด
                <strong> {formatNumber(totalFilteredItems)} </strong>          
                      รายการ
              </p>
              <ColumnToggleDropdown
                hiddenColumns={hiddenColumns}
                toggleColumnVisibility={toggleColumnVisibility}
              />
            </div>

            {/* --- Data Table --- */}
            <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
              <table
                className="min-w-full table-auto bg-white text-center 
  [&_th]:border-r [&_th]:border-gray-200
  [&_td]:border-r [&_td]:border-gray-200
  [&_th:last-child]:border-r-0
  [&_td:last-child]:border-r-0"
              >
                <thead className="bg-[#640037] text-white sticky top-0 text-sm">
                  <tr>
                    {ALL_COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        className={colClass(
                          col.key,
                          "p-3 text-sm whitespace-nowrap"
                        )}
                      >
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, idx) => {
                      const allocCurrent = calcAllocCurrent(item);
                      const alloc3 = calcAlloc3M(item);
                      const alloc6 = calcAlloc6M(item);
                      const overflow = calcOverflowScore(item);
                      const rowNumber = (currentPage - 1) * pageSize + idx + 1;

                      return (
                        <tr
                          key={item.Code}
                          className="border-b border-gray-300 hover:bg-pink-50 transition duration-100"
                        >
                          <td
                            className={colClass(
                              "No",
                              "p-3 text-sm text-gray-600"
                            )}
                          >
                            {rowNumber}
                          </td>

                          <td
                            className={colClass(
                              "Code",
                              "p-3 font-mono text-sm text-left"
                            )}
                          >
                            <span className="font-bold text-[#640037] block">
                              {item.Code}
                            </span>
                            <span className="text-xs text-gray-600">
                              {safeText(item.Brand)}
                            </span>
                          </td>

                          <td
                            className={colClass(
                              "Description",
                              "p-3 text-gray-700 text-left min-w-[250px]"
                            )}
                          >
                            <span className="font-bold">
                              {safeText(item.Description || item.description)}
                            </span>
                            <span
                              className={`ml-1 text-xs text-white px-2 py-0.5 rounded-full inline-block ${getClassStyle(
                                item.Class
                              )}`}
                            >
                              Class {item.Class}
                            </span>
                            <span className="text-xs text-gray-600 block mt-1">
                              {safeText(item.Type)}
                            </span>
                          </td>

                          <td className={colClass("Best", "p-3 text-center")}>
                            <span
                              className={`px-3 py-0.5 block rounded-full text-xs ${
                                item.YN_Best_2025 === "Yes"
                                  ? "bg-green-200 text-green-900"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {item.YN_Best_2025 === "Yes"
                                ? "Yes"
                                : "No Data Best"}
                            </span>
                          </td>

                          <td className={colClass("Forecast", "p-3")}>
                            รอระบบคีย์
                          </td>

                          <td className={colClass("Actual", "p-3")}>
                            {formatNumber(getActual(item))}
                          </td>

                          <td className={colClass("TargetNow", "p-3")}>
                            {formatNumber(getTargetNow(item))}
                          </td>

                          <td className={colClass("TargetLast", "p-3")}>
                            {formatNumber(getTargetLast(item))}
                          </td>

                          <td
                            className={colClass(
                              "DOH",
                              `p-3${getDOHStyle(item.DayOnHand_DOH_Stock2)}`
                            )}
                          >
                            {formatNumber(item.DayOnHand_DOH_Stock2, 0)}
                          </td>

                          <td
                            className={colClass(
                              "POH",
                              `p-3 ${getDOHStyle(
                                item.DayOnHand_DOH_Stock2 + 50
                              )}`
                            )}
                          >
                            {formatNumber(item.DayOnHand_DOH_Stock2 + 50, 0)}
                          </td>

                          <td
                            className={colClass(
                              "SetType",
                              "p-3 text-sm text-gray-600"
                            )}
                          >
                            ยังไม่มีข้อมูล
                          </td>

                          <td className={colClass("Stock_Physical", "p-3")}>
                            {formatNumber(safeNum(item.Stock_จบเหลือจริง))}
                          </td>

                          <td className={colClass("Stock_Show", "p-3 text-xs")}>
                            <p className="mb-1">
                              {formatNumber(
                                Math.round(
                                  (safeNum(item.Stock_จบเหลือจริง) || 0) * 0.1
                                )
                              )}
                            </p>
                            <button
                              onClick={() => handleShowStockModal(item)}
                              className="text-xs rounded-lg cursor-pointer shadow-sm bg-green-500 text-[#114232] hover:bg-green-600 transition"
                              title="ดูตำแหน่งจัดเก็บและรายละเอียด Stock (ตัวโชว์)"
                            >
                              Show Location Stock
                            </button>
                          </td>

                          <td className={colClass("Stock", "p-3")}>
                            {formatNumber(item.Stock_จบเหลือจริง)}
                          </td>

                          <td className={colClass("Stock_Cl", "p-3")}>
                            {formatNumber(item.Stock_จบเหลือจริง)}
                          </td>

                          <td className={colClass("Alloc_Current", "p-3")}>
                            {formatNumber(allocCurrent)}
                          </td>

                          <td className={colClass("Alloc_3M", "p-3")}>
                            {formatNumber(alloc3)}
                          </td>

                          <td className={colClass("Alloc_6M", "p-3")}>
                            {formatNumber(alloc6)}
                          </td>
                          <td className={colClass("OverflowScore", "p-3 ")}>
                            {overflow === null ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <span className={getOverflowStyle(overflow)}>
                                {overflow}%
                              </span>
                            )}
                          </td>

                          <td className={colClass("SaleInAgingTier", "p-3 ")}>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${getSaleInAgingTierStyle(
                                getSaleInAgingTier(item)
                              )}`}
                            >
                              {getSaleInAgingTier(item)}
                            </span>
                          </td>

                          <td
                            className={colClass("SuggestionPurchasing", "p-3")}
                          >
                            {item.SuggestionPurchasing ?? "-"}
                          </td>

                          <td
                            className={colClass(
                              "TradeStatus",
                              "p-3 text-center"
                            )}
                          >
                            <p
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyleLocal(
                                item.สถานะTrade
                              )}`}
                            >
                              {safeText(item.สถานะTrade)}
                            </p>
                            {item.DiffPercent && (
                              <p
                                className={`text-xs mt-1 font-bold ${
                                  item.DiffPercent.startsWith("-")
                                    ? "text-red-500"
                                    : "text-green-500"
                                }`}
                              >
                                {item.DiffPercent}
                              </p>
                            )}
                          </td>
                          <td
                            className={colClass(
                              "TradeRemark",
                              "p-3 text-xs text-gray-400"
                            )}
                          >
                            <p className="text-xs mb-1 italic truncate">
                              {safeText(item.RemarkTrade)}
                            </p>
                            <button
                              onClick={() => openTradeModal(item)}
                              className={`px-3 py-1 text-xs rounded-lg cursor-pointer shadow-md transition font-medium ${
                                item.KeyRemarks && item.KeyRemarks.length > 0
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              บันทึก/ดูการสื่อสาร (
                              {item.KeyRemarks ? item.KeyRemarks.length : 0})
                            </button>
                          </td>

                          <td
                            className={colClass(
                              "OverflowScore",
                              "p-3 border-r border-gray-200 text-base text-gray-700 font-medium"
                            )}
                          >
                            -
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={visibleColumnCount}
                        className="p-6 text-center text-lg text-gray-500"
                      >
                        ไม่พบข้อมูลสินค้าที่ตรงกับเงื่อนไขการกรอง
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/*  Pagination controls */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-4 text-sm text-gray-700 gap-3">
              {/* เลือก page size */}
              <div className="flex items-center gap-2">
                <span>แสดงหน้าละ</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-500 rounded-lg px-2 py-1 bg-white shadow-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>รายการ</span>
              </div>

              {/* ปุ่มเปลี่ยนหน้า */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded-lg disabled:opacity-40"
                >
                  ⏮ หน้าแรก
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-lg disabled:opacity-40"
                >
                  ก่อนหน้า
                </button>
                <span className="px-2">
                  หน้า <strong>{currentPage}</strong>
                  <strong> / {totalClientPages}</strong>
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalClientPages, p + 1))
                  }
                  disabled={currentPage === totalClientPages}
                  className="px-2 py-1 border rounded-lg disabled:opacity-40"
                >
                  ถัดไป
                </button>
                <button
                  onClick={() => setCurrentPage(totalClientPages)}
                  disabled={currentPage === totalClientPages}
                  className="px-2 py-1 border rounded-lg disabled:opacity-40"
                >
                  หน้าสุดท้าย ⏭
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
              <p>
                💡 <strong>คำอธิบาย DOH (Days On Hand):</strong>
                <span className="text-red-600 font-extrabold ml-2">
                  DOH &gt; 365 วัน
                </span>{" "}
                (Stock ล้นมาก) |
                <span className="text-orange-600 font-bold ml-2">
                  180 &lt; DOH &lt; 365 วัน
                </span>{" "}
                (ควรระวัง) |
                <span className="text-green-600 font-bold ml-2">
                  DOH &lt; 180 วัน
                </span>{" "}
                (ปกติ)
              </p>
              <p className="mt-2 text-xs text-gray-600">
                Overflow Score = (Stock - Alloc_3M) / Alloc_3M * 100. ค่า -
                คือไม่สามารถคำนวณได้ (Alloc_3M = 0)
              </p>
            </div>

            {isModalOpen && selectedItem && (
              <CommunicationCard
                item={selectedItem}
                onClose={closeTradeModal}
                onSubmit={handleSubmitAction}
                currentData={modalData}
                onDataChange={handleModalDataChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
