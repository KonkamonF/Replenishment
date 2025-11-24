import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Search, Eye, EyeOff, ChevronDown } from "lucide-react";

import StockShowModal from "../SideBar-Modal/StockModal/StockShow.jsx";
import CommunicationCard from "../SideBar-Modal/StockModal/CommunicateCard.jsx";

import { useKeyProducts } from "../hooks/useKeyProducts.js";

const getDOHStyle = (doh) => {
  if (doh === null || doh === undefined) return "text-gray-500";
  const n = Number(doh);
  if (!Number.isFinite(n)) return "text-gray-500";
  if (n > 365)
    return "text-red-600 font-extrabold bg-red-50";
  if (n > 180)
    return "text-orange-600 font-bold";
  if (n >= 0)
    return "text-green-600 font-bold";
  return "text-gray-500";
};

const safeText = (v) => {
  if (v === null || v === undefined || v === "") return "NDB";
  return v;
};

// const getDOHStockStyle = (dohStock) => {
//   if (dohStock === null || dohStock === undefined) return "text-gray-500";
//   const n = Number(dohStock);
//   if (!Number.isFinite(n)) return "text-gray-500";
//   if (n > 365) return "text-red-600 font-extrabold";
//   if (n > 180) return "text-orange-600 font-bold";
//   if (n >= 0) return "text-green-600 font-semibold";
//   return "text-gray-500";
// };

const formatNumber = (num, fractionDigits = 0) => {
  const n = Number(num);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("th-TH", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

/**
 * Column dropdown แบบสไตล์ KeyAdminUI
 */
const ColumnToggleDropdown = ({
  ALL_COLUMNS,
  hiddenColumns,
  toggleColumnVisibility,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasHiddenColumns = hiddenColumns.length > 0;
  const hiddenCount = hiddenColumns.length;

  const handleToggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left z-10" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex justify-center items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 shadow-md 
          ${
            hasHiddenColumns
              ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
              : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
          }`}
        aria-expanded={open ? "true" : "false"}
      >
        {open || hasHiddenColumns ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
        {`Columns${hiddenCount > 0 ? ` (${hiddenCount} hidden)` : ""}`}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-lg shadow-2xl bg-white ring-1 ring-pink-800 ring-opacity-20 focus:outline-none z-50">
          <div className="py-2 px-3 max-h-80 overflow-auto">
            <p className="text-xs font-semibold text-gray-500 mb-2 border-b pb-1">
              แสดง / ซ่อนคอลัมน์
            </p>
            {ALL_COLUMNS.map((col) => (
              <button
                key={col.key}
                type="button"
                onClick={() => toggleColumnVisibility(col.key)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer hover:bg-pink-50 rounded-md"
              >
                <span>{col.label}</span>
                {hiddenColumns.includes(col.key) ? (
                  <EyeOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Eye className="w-4 h-4 text-green-500" />
                )}
              </button>
            ))}
            <div className="px-1 pt-2 mt-1 text-[11px] text-gray-400 border-t">
              สามารถซ่อนคอลัมน์ที่ไม่ต้องการดูเพื่อลดความรกของตารางได้
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * ใช้ column เดิมของ KeyAdmin (logic ถูกต้องแล้ว)
 * แค่ปรับสี / style ให้โทนเหมือน KeyAdminUI
 */
const ALL_COLUMNS = [
  { key: "No", label: "No." },
  { key: "Code", label: "รหัสสินค้า / Brand" },
  { key: "Description", label: "รายละเอียด / Class / Type" },
  { key: "Best", label: "Best/BestSet" },
  { key: "Categories", label: "Categories" },
  { key: "Forecast", label: "ยอด Forecast" },
  { key: "Actual", label: "ยอด Actual" },
  { key: "DOH", label: "DOH (วัน)" },
  { key: "SetOrNot", label: "ชุด Set / แตก Set" },
  { key: "Stock_Show", label: "Stock (ตัวโชว์)" },
  { key: "Stock_Physical", label: "Stock (กายภาพ)" },
  { key: "Stock", label: "Stock หักจอง" },
  { key: "Stock_Cl", label: "Stock Clearance" },
  { key: "Forecash_Now", label: "Forecash Now" },
  { key: "Actual_Now", label: "Actual Now" },
  { key: "TradeStatus", name: "สถานะ Trade" },
  { key: "TradeRemark", name: "Remark Trade / Action" },
];

export default function KeyAdmin() {
  const roleFromStorage =
    typeof window !== "undefined" ? localStorage.getItem("role") || "" : "";
  const isSuperAdmin = roleFromStorage === "SuperAdmin";

  const [selectedItem, setSelectedItem] = useState(null);
  const [isStockShow, setIsStockShow] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    comment: "",
    newStatus: "Pending",
  });

  const [filters, setFilters] = useState({
    search: "",
    brand: "All",
    class: "All",
    best2025: "All",
    tradeStatus: "All",
    set: "All",
    salesChannelId: "All",
    keyUsername: "All",
    showUnassigned: false,
  });

  const [hiddenColumns, setHiddenColumns] = useState([]);
  const CURRENT_USER = "Trade Planner (Key)"; // ใช้แค่แสดงผล ไม่ผูก logic

  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    loading,
    error,
    totalItems,
    totalPages,
    channels,
    keyUsers,
    summary,
    filterOptions,
  } = useKeyProducts({
    filters,
    isSuperAdmin,
    page: currentPage,
    perPage: pageSize,
  });

  const toggleColumnVisibility = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };
  const isColumnHidden = (key) => hiddenColumns.includes(key);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "showUnassigned" && value === true) {
        next.salesChannelId = "All";
        next.keyUsername = "All";
      }
      return next;
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    handleFilterChange("search", e.target.value);
  };

  const uniqueBrands = useMemo(() => {
    if (filterOptions.brands && filterOptions.brands.length > 0) {
      return ["All", ...filterOptions.brands];
    }
    const brands = ["All"];
    data.forEach((item) => {
      if (item.Brand && !brands.includes(item.Brand)) {
        brands.push(item.Brand);
      }
    });
    return brands;
  }, [filterOptions.brands, data]);

  const uniqueClasses = useMemo(() => {
    if (filterOptions.classes && filterOptions.classes.length > 0) {
      return ["All", ...filterOptions.classes];
    }
    const classes = ["All"];
    data.forEach((item) => {
      if (item.Class && !classes.includes(item.Class)) {
        classes.push(item.Class);
      }
    });
    return classes;
  }, [filterOptions.classes, data]);

  const uniqueBest2025 = useMemo(() => ["All", "Yes", ""], []);

  const uniqueTradeStatus = useMemo(() => {
    if (filterOptions.tradeStatuses && filterOptions.tradeStatuses.length > 0) {
      return ["All", ...filterOptions.tradeStatuses];
    }
    const statuses = ["All"];
    data.forEach((item) => {
      if (item.สถานะTrade && !statuses.includes(item.สถานะTrade)) {
        statuses.push(item.สถานะTrade);
      }
    });
    return statuses;
  }, [filterOptions.tradeStatuses, data]);

  const uniqueSets = useMemo(() => {
    if (filterOptions.sets && filterOptions.sets.length > 0) {
      return ["All", ...filterOptions.sets];
    }
    const sets = ["All"];
    data.forEach((item) => {
      if (item.Type && !sets.includes(item.Type)) {
        sets.push(item.Type);
      }
    });
    return sets;
  }, [filterOptions.sets, data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchTerm = (filters.search || "").toLowerCase();

      if (searchTerm) {
        const haystack = [
          item.Code,
          item.Brand,
          item.Description,
          item.RemarkTrade,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(searchTerm)) return false;
      }

      if (filters.brand !== "All" && item.Brand !== filters.brand) return false;
      if (filters.class !== "All" && item.Class !== filters.class) return false;

      if (
        filters.tradeStatus !== "All" &&
        item.สถานะTrade !== filters.tradeStatus
      )
        return false;

      if (filters.set !== "All" && item.Type !== filters.set) return false;

      if (filters.best2025 === "Yes" && item.YN_Best_2025 !== "Yes")
        return false;

      return true;
    });
  }, [data, filters]);

  const totalSKUs = summary.totalSkus ?? filteredData.length;
  const totalStock =
    summary.totalStock ??
    filteredData.reduce(
      (sum, item) => sum + (item.Stock_จบเหลือจริง || 0),
      0
    );
  const avgDOH = summary.avgDohWeighted ?? 0;
  const abnormalCount =
    summary.abnormalCount ??
    filteredData.filter((it) => it.สถานะTrade === "Abnormal").length;

  const openTradeModal = (item) => {
    setSelectedItem(item);
    setModalData({
      comment: "",
      newStatus: item.สถานะTrade || "Pending",
    });
    setIsModalOpen(true);
  };

  const closeTradeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalData({ comment: "", newStatus: "Pending" });
  };

  const handleSubmitAction = () => {
    if (!selectedItem) return;
    if (!modalData.comment.trim()) {
      alert("กรุณากรอก Remark ก่อนบันทึก");
      return;
    }
    console.log(
      `บันทึกการสื่อสารสำหรับ ${selectedItem.Code}, สถานะใหม่ = ${modalData.newStatus}, Remark = ${modalData.comment} (ผู้ใช้งาน: ${CURRENT_USER})`
    );
    // **สำคัญ**: Logic จริงให้ Backend + WebSocket จัดการ update เอง
    closeTradeModal();
  };

  const handleShowStockModal = (item) => {
    setSelectedItem(item);
    setIsStockShow(true);
  };

  const handlePageChange = (nextPage) => {
    if (!nextPage || nextPage < 1) return;
    const maxPage = totalPages || 1;
    if (nextPage > maxPage) return;
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (value) => {
    const size = Number(value) || 50;
    setPageSize(size);
    setCurrentPage(1);
  };

  const visibleColumnCount = ALL_COLUMNS.filter(
    (col) => !isColumnHidden(col.key)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50 to-pink-50">
      {isStockShow && (
        <StockShowModal
          setIsStockShow={setIsStockShow}
          selectedItem={selectedItem}
        />
      )}

      {isModalOpen && selectedItem && (
        <CommunicationCard
          item={selectedItem}
          onClose={closeTradeModal}
          onSubmit={handleSubmitAction}
          modalData={modalData}
          setModalData={setModalData}
        />
      )}

      {loading && (
        <div className="text-center text-blue-500 font-semibold mt-4">
          กำลังโหลดข้อมูล...
        </div>
      )}
      {error && (
        <div className="text-center text-red-500 font-semibold mt-4">
          เกิดข้อผิดพลาด: {String(error)}
        </div>
      )}

      <div className="p-8 bg-white shadow-2xl rounded-xl">
        {/* Header */}
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-[#640037] mb-2">Key Account Monitor</h1>
          <p className="text-gray-500">ข้อมูลคงคลัง (Stock) และยอดขาย (Sale Out) พร้อมช่องทางการบันทึกและติดตาม **Action/Communication**</p>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-pink-50 p-4 rounded-lg shadow-inner">
            <p className="text-sm text-pink-600 font-semibold">Total SKUs</p>
            <p className="text-2xl font-extrabold text-[#640037]">
              {formatNumber(totalSKUs)}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
            <p className="text-sm text-blue-600 font-semibold">Total Stock</p>
            <p className="text-2xl font-extrabold">
              {formatNumber(totalStock)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-inner">
            <p className="text-sm text-yellow-600 font-semibold">Avg. DOH (Weighted)</p>
            <p className="text-2xl font-extrabold text-yellow-700">
              {avgDOH.toFixed(1)}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-inner">
            <p className="text-sm text-red-600 font-semibold">Abnormal Count</p>
            <p className="text-2xl font-extrabold text-red-700">
              {formatNumber(abnormalCount)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner hidden lg:block">
            <p className="text-sm text-gray-600 font-semibold">Total Data</p>
            <p className="text-2xl font-extrabold text-gray-700">
              {formatNumber(totalItems || data.length)}
            </p>
          </div>
        </div>

        {/* Filter bar (แถวบน) */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-4 items-end p-4 bg-pink-50 rounded-lg border border-pink-200">
          <div className="col-span-2 md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">ค้นหาสินค้า (Code/Desc/Remark)</label>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ค้นหา..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full p-2 pl-9 pr-8 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg font-bold p-1 leading-none"
                  title="ล้างการค้นหา"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500">
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
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
              className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500">
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
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
              onChange={(e) => handleFilterChange("best2025", e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500">
              {uniqueBest2025.map((b) => (
                <option key={b} value={b}>
                  {b === "" ? "(ว่าง)" : b}
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
              className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500">
              {uniqueTradeStatus.map((st) => (
                <option key={st} value={st}>
                  {st}
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
              className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500">
              {uniqueSets.map((setV) => (
                <option key={setV} value={setV}>
                  {setV}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter แถวล่าง: ห้าง + Key + checkbox */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm bg-white/70 rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">ห้าง:</span>
            <select
              value={filters.salesChannelId}
              onChange={(e) =>
                handleFilterChange("salesChannelId", e.target.value)
              }
              className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
              disabled={filters.showUnassigned}
            >
              <option value="All">ทุกห้าง</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          {isSuperAdmin && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Key:</span>
              <select
                value={filters.keyUsername}
                onChange={(e) =>
                  handleFilterChange("keyUsername", e.target.value)
                }
                className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                disabled={filters.showUnassigned}
              >
                <option value="All">ทุก Key</option>
                {keyUsers.map((u) => (
                  <option key={u.username} value={u.username}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showUnassigned}
              onChange={(e) =>
                handleFilterChange("showUnassigned", e.target.checked)
              }
              className="rounded"
            />
            <span className="text-gray-700">
              แสดงเฉพาะสินค้าที่ไม่มี Key ดูแล
            </span>
          </label>
        </div>

        {/* Column toggle + page size (บนตาราง) */}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
          
                
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>แสดงหน้าละ</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="border border-gray-500 rounded-lg px-2 py-1 bg-white shadow-sm"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>รายการ</span>

          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">
              ซ่อน/แสดงคอลัมน์เพื่อดูเฉพาะข้อมูลที่ต้องการ
            </p>
            <ColumnToggleDropdown
              ALL_COLUMNS={ALL_COLUMNS}
              hiddenColumns={hiddenColumns}
              toggleColumnVisibility={toggleColumnVisibility}
            />
            
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
          <table className="min-w-full table-auto bg-white text-center">
            <thead className="bg-[#640037] text-white sticky top-0 text-sm">
              <tr>
                {!isColumnHidden("No") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    No.
                  </th>
                )}
                {!isColumnHidden("Code") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    ItemCode / Brand
                  </th>
                )}
                {!isColumnHidden("Description") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Description / Class
                  </th>
                )}
                {!isColumnHidden("Best") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Best/BestSet
                  </th>
                )}
                {!isColumnHidden("Categories") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Categories
                  </th>
                )}
                {!isColumnHidden("Forecast") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    ยอด Forecast
                  </th>
                )}
                {!isColumnHidden("Actual") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    ยอด Actual
                  </th>
                )}
                {!isColumnHidden("DOHPerDay") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    DOH (วัน)
                  </th>
                )}
                {!isColumnHidden("SetOrNot") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    ชุด Set / แตก Set
                  </th>
                )}
                {!isColumnHidden("Stock_Show") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Stock (ตัวโชว์)
                  </th>
                )}
                {!isColumnHidden("Stock_Physical") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Stock (กายภาพ)
                  </th>
                )}
                {!isColumnHidden("Stock") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Stock หักจอง
                  </th>
                )}
                {!isColumnHidden("Stock_Cl") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Stock Clearance
                  </th>
                )}
                {!isColumnHidden("Forecash_Now") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Forecash Now
                  </th>
                )}
                {!isColumnHidden("Actual_Now") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Actual Now
                  </th>
                )}
                {!isColumnHidden("TradeStatus") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    สถานะ Trade
                  </th>
                )}
                {!isColumnHidden("TradeRemark") && (
                  <th className="p-3 border-l border-gray-500/30 first:border-l-0 whitespace-nowrap">
                    Remark Trade / Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => {
                  const rowNo = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={item.Code}
                      className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
                    >
                      {!isColumnHidden("No") && (
                        <td className="p-3 min-w-50px">
                          {rowNo}
                        </td>
                      )}

                      {!isColumnHidden("Code") && (
                        <td className="p-3 font-mono text-sm border-r border-gray-200 text-left min-w-[120px]">
                          <span className="font-bold text-[#640037] block">
                            {item.Code}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.Brand}
                          </span>
                        </td>
                      )}

                      {!isColumnHidden("Description") && (
                        <td className="p-3 font-semibold text-gray-700 border-r border-gray-200 text-left min-w-[200px]">
                          <span className="block">{item.Description}</span>
                          <span
                            className={`mt-1 inline-block text-xs font-normal px-2 py-0.5 rounded-full ${
                              item.Class === "A"
                                ? "bg-orange-500 text-white"
                                : item.Class === "B"
                                ? "bg-blue-500 text-white"
                                : item.Class === "C"
                                ? "bg-yellow-500 text-white"
                                : "bg-pink-500 text-white"
                            }`}
                          >
                            Class {item.Class}
                          </span>
                          <span className="text-xs text-gray-400 block mt-1">
                            {item.Type} ({item.SubType})
                          </span>
                        </td>
                      )}

                      {!isColumnHidden("Best") && (
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              item.YN_Best_2025 === "Yes"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.YN_Best_2025 === "Yes" ? "Yes" : "No"}
                          </span>
                        </td>
                      )}

                      {!isColumnHidden("Categories") && (
                        <td className="p-3">
                            {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("Forecast") && (
                        <td className="p-3 font-bold text-lg border-r border-gray-200 text-right">
                            {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("Actual") && (
                        <td className="p-3 font-semibold text-lg border-r border-gray-200 text-right text-blue-600">
                            {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("DOH") && (
                        <td className={`p-3 font-extrabold text-lg border-r border-gray-200 ${getDOHStyle(item.DayOnHand_DOH_Stock2)} text-right`}>
                            {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("SetType") && (
                        <td className="p-3 text-sm text-gray-600">
                            {"-"}
                        </td>
                      )}

                      {!isColumnHidden("StockShow") && (
                        <td className="p-3 text-sm text-gray-500">
                          <div className="font-semibold text-base text-gray-800 mb-1">
                            {formatNumber(item.Stock_Show_Calc)}
                          </div>
                          <button
                            className="p-2 text-xs rounded-lg cursor-pointer shadow-sm bg-green-500 text-white hover:bg-green-600 transition"
                            onClick={() => handleShowStockModal(item)}
                            title="ดูตำแหน่งจัดเก็บและรายละเอียด Stock (ตัวโชว์)"
                          >
                            Show Location Stock
                          </button>
                        </td>
                      )}

                      {!isColumnHidden("Stock_Physical") && (
                        <td className="p-3 font-bold text-lg border-r border-gray-200 text-right">
                            {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("Stock") && (
                        <td className="p-3 font-bold text-lg border-r border-gray-200 text-right">
                            {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("Stock_Cl") && (
                        <td className="p-3 font-bold text-lg border-r border-gray-200 text-right">
                            {formatNumber(item.Stock_จบเหลือจริง)}
                        </td>
                      )}

                      {!isColumnHidden("Forecash") && (
                        <td className="p-3 font-bold border-r border-gray-200">
                            {"-"}
                        </td>
                      )}

                      {!isColumnHidden("Actual") && (
                        <td className="p-3 font-bold border-r border-gray-200">
                            {"-"}
                        </td>
                      )}

                      {!isColumnHidden("TradeStatus") && (
                        <td className="p-3 border-r border-gray-200">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              item.สถานะTrade === "Abnormal"
                                ? "bg-red-100 text-red-700 border-red-300"
                                : item.สถานะTrade === "Normal"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }`}
                          >
                            {item.สถานะTrade || "Normal"}
                          </span>
                        </td>
                      )}

                      {!isColumnHidden("RemarkTrade") && (
                        <td className="p-3 text-xs text-gray-400 border-r border-gray-200">
                          <p className="text-xs mb-1 italic truncate">
                            {safeText(item.RemarkTrade)}
                          </p>

                          <button
                            onClick={() => openTradeModal(item)}
                            className={`px-3 py-1 text-xs rounded-lg cursor-pointer shadow-md transition font-medium ${
                              item.RemarkCount > 0
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            บันทึก/ดูการสื่อสาร ({item.RemarkCount || 0})
                          </button>
                        </td>
                      )}
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

        {/* Pagination ด้านล่าง */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 text-sm text-gray-700 gap-3">
          <div className="flex items-center gap-2">
            <span>แสดงหน้าละ</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="border border-gray-500 rounded-lg px-2 py-1 bg-white shadow-sm"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>รายการ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50"
            >
              ⏮ หน้าแรก
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50"
            >
              ก่อนหน้า
            </button>

            <span className="px-2">
              หน้า <strong>{currentPage}</strong> /{" "}
              <strong>{totalPages || 1}</strong>
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === (totalPages || 1)}
              className="px-2 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50"
            >
              ถัดไป
            </button>
            <button
              onClick={() => handlePageChange(totalPages || 1)}
              disabled={currentPage === (totalPages || 1)}
              className="px-2 py-1 border rounded-lg disabled:opacity-40 bg-white hover:bg-gray-50"
            >
              หน้าสุดท้าย ⏭
            </button>
          </div>
        </div>

        {/* DOH Explain */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-100">
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
        </div>
      </div>
    </div>
  );
}
