import React, { useState, useMemo } from "react";
import { Search, Eye, EyeOff, ChevronDown, Upload } from "lucide-react";

// --- Mock Component for Uploadimg ---
const Uploadimg = () => (
    <div className="flex items-center justify-center p-2 mt-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-100 transition">
        <Upload className="w-4 h-4 mr-2" />
        {/* Mock Upload Image Text (Thai) */}
        แนบไฟล์รูปภาพ
    </div>
);

// --- Mock Data (ชุดข้อมูล Inventory/Trade) ---
const mockInventoryData = [
    {
        Code: "06-0005-01",
        Type: "TableTop",
        Class: "B",
        YN_Best_2025: "",
        Brand: "Tecno*",
        Description: "TNS IR 05",
        SubType: "s2il",
        ราคา_กลาง_หน่วย: 1390,
        ราคา_โปรล่าสุด: 1290,
        DayOnHand_DOH: 1413,
        DayOnHand_DOH_Stock2: 376.71,
        TargetSaleUnit_1: 70,
        SaleOutเฉลี่ยวัน: 1.42,
        Stock_จบเหลือจริง: 879,
        SaleOut_มีค68: 43,
        SaleOut_เมย68: 41,
        SaleOut_พค68: 48,
        SaleOut_มิย68: 28,
        Sale_in_Aging_Tier: "Aging1 M",
        สถานะTrade: "Abnormal",
        RemarkTrade: "AC น้อยกว่า FC เกิน 20%",
        DiffPercent: "-90.48%",
        LeadTime: 90,
        ตัดจ่ายเฉลี่ย3เดือน: 6.67,
        KeyRemarks: [
            {
                key: 1,
                date: "2025-10-01",
                user: "Admin A",
                text: "สินค้า DOH สูงมาก ควรทำโปรโมชั่นพิเศษด่วน.",
            },
        ],
    },
    {
        Code: "06-0003-01",
        Type: "TableTop",
        Class: "B",
        YN_Best_2025: "Yes",
        Brand: "Tecno*",
        Description: "Table top 1",
        SubType: "s1g1il",
        ราคา_กลาง_หน่วย: 1290,
        ราคา_โปรล่าสุด: 1250,
        DayOnHand_DOH: 310,
        DayOnHand_DOH_Stock2: 148.32,
        TargetSaleUnit_1: 140,
        SaleOutเฉลี่ยวัน: 2.45,
        Stock_จบเหลือจริง: 670,
        SaleOut_มีค68: 64,
        SaleOut_เมย68: 70,
        SaleOut_พค68: 71,
        SaleOut_มิย68: 65,
        Sale_in_Aging_Tier: "No Aging",
        สถานะTrade: "Abnormal",
        RemarkTrade: "AC น้อยกว่า FC เกิน 20%",
        DiffPercent: "-68.12%",
        LeadTime: 80,
        ตัดจ่ายเฉลี่ย3เดือน: 38.2,
        KeyRemarks: [
            {
                key: 1,
                date: "2025-10-02",
                user: "KeyUser B",
                text: "ลูกค้าบ่นเรื่องราคาโปร ไม่ดึงดูดใจเท่าที่ควร.",
            },
            {
                key: 2,
                date: "2025-10-03",
                user: "Admin A",
                text: "รับทราบ. จะพิจารณาราคาโปรโมชั่นใหม่สำหรับเดือนหน้า.",
            },
        ],
    },
    {
        Code: "06-0003-02",
        Type: "TableTop",
        Class: "A",
        YN_Best_2025: "",
        Brand: "Tecno*",
        Description: "Table top 2",
        SubType: "s2g1il",
        ราคา_กลาง_หน่วย: 1450,
        ราคา_โปรล่าสุด: 1390,
        DayOnHand_DOH: 295,
        DayOnHand_DOH_Stock2: 160.44,
        TargetSaleUnit_1: 120,
        SaleOutเฉลี่ยวัน: 2.88,
        Stock_จบเหลือจริง: 710,
        SaleOut_มีค68: 72,
        SaleOut_เมย68: 76,
        SaleOut_พค68: 80,
        SaleOut_มิย68: 78,
        Sale_in_Aging_Tier: "Fresh",
        สถานะTrade: "Normal",
        RemarkTrade: "ยอดขายสอดคล้องกับแผน",
        DiffPercent: "-25.32%",
        LeadTime: 75,
        ตัดจ่ายเฉลี่ย3เดือน: 42.5,
        KeyRemarks: [], // No remarks yet
    },
    {
        Code: "06-0003-03",
        Type: "TableTop",
        Class: "C",
        YN_Best_2025: "",
        Brand: "Tecno*",
        Description: "Table top 3",
        SubType: "s3g2il",
        ราคา_กลาง_หน่วย: 1100,
        ราคา_โปรล่าสุด: 990,
        DayOnHand_DOH: 420,
        DayOnHand_DOH_Stock2: 190.12,
        TargetSaleUnit_1: 90,
        SaleOutเฉลี่ยวัน: 1.95,
        Stock_จบเหลือจริง: 560,
        SaleOut_มีค68: 38,
        SaleOut_เมย68: 42,
        SaleOut_พค68: 39,
        SaleOut_มิย68: 40,
        Sale_in_Aging_Tier: "Aging2 M",
        สถานะTrade: "Abnormal",
        RemarkTrade: "สินค้าเคลื่อนไหวน้อย",
        DiffPercent: "-82.67%",
        LeadTime: 95,
        ตัดจ่ายเฉลี่ย3เดือน: 18.6,
        KeyRemarks: [],
    },
    {
        Code: "06-0003-04",
        Type: "TableTop",
        Class: "B",
        YN_Best_2025: "Yes",
        Brand: "Tecno*",
        Description: "Table top 4",
        SubType: "s4g1il",
        ราคา_กลาง_หน่วย: 1350,
        ราคา_โปรล่าสุด: 1320,
        DayOnHand_DOH: 285,
        DayOnHand_DOH_Stock2: 140.56,
        TargetSaleUnit_1: 150,
        SaleOutเฉลี่ยวัน: 3.12,
        Stock_จบเหลือจริง: 695,
        SaleOut_มีค68: 81,
        SaleOut_เมย68: 79,
        SaleOut_พค68: 85,
        SaleOut_มิย68: 83,
        Sale_in_Aging_Tier: "Fresh",
        สถานะTrade: "Normal",
        RemarkTrade: "สินค้าขายดีตามแผน",
        DiffPercent: "-15.24%",
        LeadTime: 70,
        ตัดจ่ายเฉลี่ย3เดือน: 55.4,
        KeyRemarks: [],
    },
];
// -----------------

// --- Helper Functions (สำหรับแสดงผล) ---
const getDOHStyle = (doh) => {
    if (doh === null || doh === undefined) return "text-gray-500";
    if (doh > 365) return "text-red-600 font-extrabold bg-red-50";
    if (doh > 180) return "text-orange-600 font-bold";
    return "text-green-600 font-bold";
};

const getStatusStyle = (status) => {
    switch (status) {
        case "Abnormal":
            return "bg-red-100 text-red-800 border-red-300";
        case "Normal":
            return "bg-green-100 text-green-800 border-green-300";
        default:
            return "bg-gray-100 text-gray-800 border-gray-300";
    }
};

const formatNumber = (num, decimals = 0) => {
    if (num === null || num === undefined) return "-";
    return num.toLocaleString("en-US", { maximumFractionDigits: decimals });
};

// --- Trade Remark Modal Component ---
function TradeRemarkModal({ product, onClose, onAddRemark }) {
    const [remarkText, setRemarkText] = useState("");
    const currentUser = "Key User (Admin)"; // จำลองผู้ใช้งานปัจจุบัน

    const handleAddRemark = () => {
        if (remarkText.trim()) {
            const newRemark = {
                key: Date.now(),
                date: new Date().toISOString().slice(0, 10), // Format YYYY-MM-DD
                user: currentUser,
                text: remarkText.trim(),
            };
            onAddRemark(product.Code, newRemark);
            setRemarkText("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl p-6 shadow-2xl overflow-y-scroll max-h-full">
                <div className="flex justify-between items-start border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-[#640037]">
                        บันทึกการสื่อสาร/ติดตาม: {product.Code}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-3xl text-gray-500 cursor-pointer hover:text-red-500"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                <p className="text-gray-700 mb-4 font-medium">{product.Description}</p>

                {/* Remark History */}
                <div className="h-64 overflow-y-auto mb-4 space-y-3 p-2 border rounded-lg bg-gray-50 ">
                    {product.KeyRemarks && product.KeyRemarks.length > 0 ? (
                        product.KeyRemarks.slice()
                            .reverse()
                            .map((remark) => (
                                <div
                                    key={remark.key || Date.now() + Math.random()} // Ensure key exists
                                    className="border-l-4 border-pink-400 pl-3 py-1 bg-white rounded shadow-sm"
                                >
                                    <p className="font-semibold text-sm">
                                        {remark.user}
                                        <span className="text-xs font-normal text-gray-500 ml-2">
                                            ({remark.date})
                                        </span>
                                    </p>
                                    <p className="text-gray-800">{remark.text}</p>
                                </div>
                            ))
                    ) : (
                        <p className="text-gray-500 text-center pt-8">
                            ยังไม่มีบันทึกการสื่อสารเฉพาะกิจ
                        </p>
                    )}
                </div>

                {/* New Remark Input */}
                <div className="pt-4 border-t border-gray-200">
                    <label className="block text-gray-700 font-semibold mb-2">
                        เพิ่มบันทึกใหม่ ในนาม: {currentUser}
                    </label>
                    <textarea
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-300"
                        rows="3"
                        placeholder="พิมพ์บันทึกการสื่อสารหรือข้อเสนอแนะ..."
                        value={remarkText}
                        onChange={(e) => setRemarkText(e.target.value)}
                    ></textarea>
                    <Uploadimg />
                    <button
                        onClick={handleAddRemark}
                        className="mt-2 w-full px-4 py-2 bg-pink-600 cursor-pointer text-white font-semibold rounded-lg hover:bg-pink-700 transition shadow-md disabled:bg-pink-300"
                        disabled={!remarkText.trim()}
                    >
                        บันทึกการสื่อสาร
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- List of ALL Toggleable Columns ---
const ALL_COLUMNS = [
    { key: "Code", name: "ItemCode / Brand", isAlwaysVisible: true },
    { key: "Description", name: "Description / Class", isAlwaysVisible: true },
    { key: "Best", name: "Best/BestSet", isAlwaysVisible: false },
    { key: "Forecast", name: "ยอด Forecast", isAlwaysVisible: false },
    { key: "Actual", name: "ยอด Actual", isAlwaysVisible: false },
    { key: "DOH", name: "DOH (วัน)", isAlwaysVisible: false },
    { key: "SetType", name: "ชุด Set / แตก Set", isAlwaysVisible: false },
    { key: "Stock_Physical", name: "Stock (กายภาพ)", isAlwaysVisible: false },
    { key: "Stock_Show", name: "Stock (ตัวโชว์)", isAlwaysVisible: false },
    { key: "TradeStatus", name: "สถานะ Trade", isAlwaysVisible: false },
    { key: "TradeRemark", name: "Remark Trade / Action", isAlwaysVisible: false },
];

// --- Column Toggle Dropdown Component ---
function ColumnToggleDropdown({ hiddenColumns, toggleColumnVisibility }) {
    // กรองคอลัมน์ที่ไม่ใช่ isAlwaysVisible เพื่อให้ผู้ใช้สามารถซ่อนได้
    const toggleableColumns = ALL_COLUMNS.filter((col) => !col.isAlwaysVisible);

    const hasHiddenColumns = hiddenColumns.length > 0;
    const hiddenCount = hiddenColumns.length;

    // Handler เพื่อซ่อน/แสดง Dropdown Menu
    const toggleMenu = () => {
        const menu = document.getElementById("column-menu");
        if (menu) {
            menu.classList.toggle("hidden");
        }
    };

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={toggleMenu}
                className={`inline-flex justify-center items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 shadow-md 
                ${
                    hasHiddenColumns
                        ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
                        : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
                }`}
                aria-expanded={hasHiddenColumns ? "true" : "false"}
            >
                {hasHiddenColumns ? (
                    <EyeOff className="w-4 h-4" />
                ) : (
                    <Eye className="w-4 h-4" />
                )}
                {`Show/Hide Columns ${hiddenCount > 0 ? `(${hiddenCount})` : ""}`}
                <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            <div
                id="column-menu"
                className="hidden origin-top-right absolute right-0 mt-2 w-72 rounded-lg shadow-2xl bg-white ring-1 ring-pink-800 ring-opacity-20 focus:outline-none z-50"
                role="menu"
                aria-orientation="vertical"
                tabIndex={-1} // Make div focusable
                onBlur={(e) => {
                    // Simple focus-out handler for demonstration in this environment
                    setTimeout(() => {
                        if (!e.currentTarget.contains(document.activeElement)) {
                            e.currentTarget.classList.add("hidden");
                        }
                    }, 0);
                }}
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
                            role="menuitem"
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
                        ItemCode และ Description ถูกตั้งค่าให้แสดงเสมอ
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Component (เปลี่ยนชื่อเป็น App) ---
export default function InventoryTradeMonitorWithFilters() {
    const [data, setData] = useState(mockInventoryData);
    const [filters, setFilters] = useState({
        search: "",
        brand: "All",
        class: "All",
        best2025: "All",
        tradeStatus: "All",
        set: "All",
    });
    const [modalRemarkProduct, setModalRemarkProduct] = useState(null);
    // State สำหรับจัดการคอลัมน์ที่ถูกซ่อน (Array of keys)
    const [hiddenColumns, setHiddenColumns] = useState([]);

    // Logic สำหรับการซ่อน/แสดงคอลัมน์
    const toggleColumnVisibility = (key) => {
        if (hiddenColumns.includes(key)) {
            setHiddenColumns(hiddenColumns.filter((col) => col !== key));
        } else {
            setHiddenColumns([...hiddenColumns, key]);
        }
    };

    const isColumnHidden = (key) => hiddenColumns.includes(key);

    // Unique Filter Options
    const uniqueBrands = useMemo(
        () => ["All", ...new Set(data.map((item) => item.Brand))],
        [data]
    );
    const uniqueClasses = useMemo(
        () => ["All", ...new Set(data.map((item) => item.Class))],
        [data]
    );
    // ใช้ "" สำหรับ (Blank)
    const uniqueBest2025 = useMemo(() => ["All", "Yes", ""], []);
    const uniqueTradeStatus = useMemo(
        () => ["All", ...new Set(data.map((item) => item.สถานะTrade))],
        [data]
    );
    // ใช้ Type เป็น Mock สำหรับ Set/แยก Set
    const uniqueSets = useMemo(
        () => ["All", ...new Set(data.map((item) => item.Type))],
        [data]
    );

    // Filtered Data Logic
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // 1. Search Filter (Code, Description, RemarkTrade)
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                item.Code.toLowerCase().includes(searchTerm) ||
                item.Description.toLowerCase().includes(searchTerm) ||
                (item.RemarkTrade && item.RemarkTrade.toLowerCase().includes(searchTerm));

            // 2. Brand Filter
            const matchesBrand =
                filters.brand === "All" || item.Brand === filters.brand;

            // 3. Class Filter
            const matchesClass =
                filters.class === "All" || item.Class === filters.class;

            // 4. Best 2025 Filter
            const bestValue = item.YN_Best_2025 || ""; // Treat "" as blank
            const matchesBest2025 =
                filters.best2025 === "All" || filters.best2025 === bestValue;

            // 5. Trade Status Filter
            const matchesTradeStatus =
                filters.tradeStatus === "All" ||
                item.สถานะTrade === filters.tradeStatus;

            // 6. Set/Type Filter (ใช้ Type จาก Mock data)
            const matchesSet = filters.set === "All" || item.Type === filters.set;

            return (
                matchesSearch &&
                matchesBrand &&
                matchesClass &&
                matchesBest2025 &&
                matchesTradeStatus &&
                matchesSet
            );
        });
    }, [filters, data]);

    // --- Summary Calculation ---
    const summaryMetrics = useMemo(() => {
        const totalSKUs = filteredData.length;
        const totalStock = filteredData.reduce(
            (sum, item) => sum + (item.Stock_จบเหลือจริง || 0),
            0
        );
        // Calculate weighted average DOH for Avg DOH (using DOH Stock2 for consistency)
        const totalStockWeightedDOH = filteredData.reduce((sum, item) => {
            return sum + (item.Stock_จบเหลือจริง * item.DayOnHand_DOH_Stock2 || 0);
        }, 0);

        const avgDOH = totalStock > 0 ? totalStockWeightedDOH / totalStock : 0;

        const abnormalCount = filteredData.filter(
            (item) => item.สถานะTrade === "Abnormal"
        ).length;

        return {
            totalSKUs,
            totalStock,
            avgDOH,
            abnormalCount,
        };
    }, [filteredData]);

    const { totalSKUs, totalStock, avgDOH, abnormalCount } = summaryMetrics;

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenRemarkModal = (product) => {
        setModalRemarkProduct(product);
    };

    const handleAddRemark = (productCode, newRemark) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.Code === productCode
                    ? { ...item, KeyRemarks: [...(item.KeyRemarks || []), newRemark] }
                    : item
            )
        );
        setModalRemarkProduct((prevProduct) => {
            if (prevProduct && prevProduct.Code === productCode) {
                return {
                    ...prevProduct,
                    KeyRemarks: [...(prevProduct.KeyRemarks || []), newRemark],
                };
            }
            return prevProduct;
        });
        console.log(`บันทึกการสื่อสารสำหรับ ${productCode} สำเร็จ!`);
    };

    // คำนวณ ColSpan สำหรับแถบ 'ไม่พบข้อมูล'
    const visibleColumnCount = ALL_COLUMNS.filter(col => !isColumnHidden(col.key)).length + 1; // +1 for No. column

    return (
        <div className="  min-h-screen ">
            <script src="https://cdn.tailwindcss.com"></script>
            <div className="p-8 bg-white shadow-2xl rounded-xl">
                {/* --- Header & Summary --- */}
                <header className="mb-6 border-b pb-4">
                    <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
                        Key Account (Sale) Monitor
                    </h1>
                    <p className="text-gray-500">
                        ข้อมูลคงคลัง (Stock) และยอดขาย (Sale Out)
                        พร้อมระบบค้นหาและกรองข้อมูล
                    </p>
                </header>

                {/* --- Summary Card Component --- */}
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
                        <p className="text-sm text-yellow-600 font-semibold">
                            Avg. DOH (Weighted)
                        </p>
                        <p className="text-2xl font-extrabold">
                            {formatNumber(avgDOH)} วัน
                        </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg shadow-inner">
                        <p className="text-sm text-red-600 font-semibold">Abnormal Count</p>
                        <p className="text-2xl font-extrabold">
                            {formatNumber(abnormalCount)}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner hidden lg:block">
                        <p className="text-sm text-gray-600 font-semibold">Total Data</p>
                        <p className="text-2xl font-extrabold text-gray-700">
                            {formatNumber(data.length)}
                        </p>
                    </div>
                </div>

                {/* --- Filters & Search Bar --- */}
                <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-4 items-end p-4 bg-pink-50 rounded-lg border border-pink-200">
                    {/* Search Bar */}
                    <div className="col-span-2 md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            ค้นหาสินค้า (Code/Desc/Remark)
                        </label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="ค้นหา..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                className="w-full p-2 pl-9 pr-8 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            {filters.search && (
                                <button
                                    onClick={() => {
                                        handleFilterChange("search", "");
                                    }}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 hover:text-red-500 font-bold p-1 leading-none"
                                    title="ล้างการค้นหา"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Brand Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 ">
                            Brand
                        </label>
                        <div className="relative">
                            <select
                                value={filters.brand}
                                onChange={(e) => handleFilterChange("brand", e.target.value)}
                                className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                            >
                                {uniqueBrands.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Class Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Class
                        </label>
                        <div className="relative">
                            <select
                                value={filters.class}
                                onChange={(e) => handleFilterChange("class", e.target.value)}
                                className="w-full p-2 pr-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm bg-white focus:ring-pink-500 focus:border-pink-500"
                            >
                                {uniqueClasses.map((cls) => (
                                    <option key={cls} value={cls}>
                                        {cls}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Best 2025 Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            YN Best 2025
                        </label>
                        <div className="relative">
                            <select
                                value={filters.best2025}
                                onChange={(e) => handleFilterChange("best2025", e.target.value)}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white focus:ring-pink-500 focus:border-pink-500"
                            >
                                {uniqueBest2025.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt === "" ? "(Blank)" : opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Trade Status Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            สถานะ Trade
                        </label>
                        <div className="relative">
                            <select
                                value={filters.tradeStatus}
                                onChange={(e) =>
                                    handleFilterChange("tradeStatus", e.target.value)
                                }
                                className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white focus:ring-pink-500 focus:border-pink-500"
                            >
                                {uniqueTradeStatus.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Set/Type Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            ชุด Set / แตก Set
                        </label>
                        <div className="relative">
                            <select
                                value={filters.set}
                                onChange={(e) => handleFilterChange("set", e.target.value)}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white focus:ring-pink-500 focus:border-pink-500"
                            >
                                {uniqueSets.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600 font-medium">
                        แสดงผล **{formatNumber(filteredData.length)}** รายการ จากทั้งหมด **
                        {formatNumber(data.length)}** รายการ
                    </p>
                    {/* Component ถูกเรียกใช้พร้อม Props ที่จำเป็น */}
                    <ColumnToggleDropdown
                        hiddenColumns={hiddenColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

                {/* --- Data Table Container --- */}
                <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
                    <table className="min-w-full table-auto bg-white text-center">
                        <thead className="bg-[#640037] text-white sticky top-0 text-sm">
                            <tr>
                                <th className="p-3 min-w-[50px]">No.</th>
                                {/* Render Headers Conditionally */}
                                {ALL_COLUMNS.map(
                                    (col) =>
                                        !isColumnHidden(col.key) && (
                                            <th
                                                key={col.key}
                                                className="p-3 whitespace-nowrap min-w-[120px] border-l border-gray-500/30"
                                            >
                                                {col.name}
                                            </th>
                                        )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <tr
                                        key={item.Code}
                                        className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
                                    >
                                        <td className="p-3">{index + 1}</td>

                                        {/* 1. ItemCode / Brand */}
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

                                        {/* 2. Description / Class */}
                                        {!isColumnHidden("Description") && (
                                            <td className="p-3 font-semibold text-gray-700 border-r border-gray-200 text-left min-w-[200px]">
                                                <span className="block">{item.Description}</span>
                                                <span
                                                    className={`ml-1 text-xs font-normal text-white px-2 py-0.5 rounded-full inline-block ${
                                                        item.Class === "A" ? "bg-orange-500" : "bg-pink-500"
                                                    }`}
                                                >
                                                    Class {item.Class}
                                                </span>
                                                <span className="text-xs text-gray-400 block mt-1">
                                                    {item.Type} ({item.SubType})
                                                </span>
                                            </td>
                                        )}

                                        {/* 3. Best/BestSet */}
                                        {!isColumnHidden("Best") && (
                                            <td className="p-3">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        item.YN_Best_2025 === "Yes"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {item.YN_Best_2025 || "No"}
                                                </span>
                                            </td>
                                        )}

                                        {/* 4. ยอด Forecast (TargetSaleUnit_1) */}
                                        {!isColumnHidden("Forecast") && (
                                            <td className="p-3 font-bold text-lg border-r border-gray-200 text-right">
                                                {formatNumber(item.TargetSaleUnit_1)}
                                            </td>
                                        )}

                                        {/* 5. ยอด Actual (SaleOut_เมย68) */}
                                        {!isColumnHidden("Actual") && (
                                            <td className="p-3 font-semibold text-lg border-r border-gray-200 text-right text-blue-600">
                                                {formatNumber(item.SaleOut_เมย68)}
                                            </td>
                                        )}

                                        {/* 6. DOH (วัน) */}
                                        {!isColumnHidden("DOH") && (
                                            <td
                                                className={`p-3 font-extrabold text-lg border-r border-gray-200 ${getDOHStyle(
                                                    item.DayOnHand_DOH_Stock2
                                                )} text-right`}
                                            >
                                                {formatNumber(item.DayOnHand_DOH_Stock2, 0)}
                                            </td>
                                        )}

                                        {/* 7. ชุด Set / แตก Set (SubType) */}
                                        {!isColumnHidden("SetType") && (
                                            <td className="p-3 text-sm text-gray-600">
                                                {item.SubType || "-"}
                                            </td>
                                        )}

                                        {/* 8. Stock (กายภาพ) (Stock_จบเหลือจริง) */}
                                        {!isColumnHidden("Stock_Physical") && (
                                            <td className="p-3 font-bold text-lg border-r border-gray-200 text-right">
                                                {formatNumber(item.Stock_จบเหลือจริง)}
                                            </td>
                                        )}

                                        {/* 9. Stock (ตัวโชว์) (Mock 10%) */}
                                        {!isColumnHidden("Stock_Show") && (
                                            <td className="p-3 text-sm text-gray-500 text-right">
                                                {formatNumber(Math.round(item.Stock_จบเหลือจริง * 0.1))}
                                            </td>
                                        )}

                                        {/* 10. สถานะ Trade */}
                                        {!isColumnHidden("TradeStatus") && (
                                            <td className="p-3 border-r border-gray-200">
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(
                                                        item.สถานะTrade
                                                    )}`}
                                                >
                                                    {item.สถานะTrade}
                                                </span>
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
                                        )}

                                        {/* 11. Remark Trade / Action */}
                                        {!isColumnHidden("TradeRemark") && (
                                            <td className="p-3 text-sm max-w-xs whitespace-normal text-gray-600 border-r border-gray-200">
                                                <p className="text-xs mb-1 italic truncate">
                                                    {item.RemarkTrade || "-"}
                                                </p>
                                                <button
                                                    onClick={() => handleOpenRemarkModal(item)}
                                                    className={`px-3 py-1 text-xs rounded-lg cursor-pointer shadow-md transition font-medium
                                                    ${
                                                        item.KeyRemarks &&
                                                        item.KeyRemarks.length > 0
                                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                                >
                                                    บันทึก/ดูการสื่อสาร (
                                                    {item.KeyRemarks ? item.KeyRemarks.length : 0})
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
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

                <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
                    <p>
                        💡 **คำอธิบาย DOH (Days On Hand):**
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

                {/* --- TRADE REMARK MODAL --- */}
                {modalRemarkProduct && (
                    <TradeRemarkModal
                        product={modalRemarkProduct}
                        onClose={() => setModalRemarkProduct(null)}
                        onAddRemark={handleAddRemark}
                    />
                )}
            </div>
        </div>
    );
}