// src/hooks/useTradeProducts.js
import { useState, useEffect } from "react";
import { API_BASE_URL, API_TOKEN } from "../config/apiConfig";
import { getToken } from "../utils/auth";
import { authFetch } from "../utils/authFetch";

// ---------- Helpers ----------
const safeNum = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeText = (v) => {
  if (v === null || v === undefined) return "NDB";
  if (typeof v === "string") {
    const trimmed = v.trim();
    return trimmed === "" ? "NDB" : trimmed;
  }
  return v;
};

// สร้าง filters param ให้ตรงกับ backend
const buildFiltersParam = (filters = {}) => {
  const parts = [];

  if (filters.class && filters.class !== "All") {
    parts.push(`manualClass=${filters.class}`);
  }

  if (filters.brand && filters.brand !== "All") {
    parts.push(`brand=${filters.brand}`);
  }

  if (filters.tradeStatus && filters.tradeStatus !== "All") {
    parts.push(`tradeStatus=${filters.tradeStatus}`);
  }

  if (filters.set && filters.set !== "All") {
    parts.push(`type=${filters.set}`);
  }

  if (filters.best2025 && filters.best2025 !== "All") {
    parts.push(`best2025=${filters.best2025}`);
  }

  return parts.join(",");
};

// map row จาก API → รูปแบบที่หน้า Trade ใช้
const mapTradeRow = (item) => ({
  ...item,

  Code: safeText(item.itemCode),
  Brand: safeText(item.brand),
  Description: safeText(item.Description ?? item.description),
  Class: safeText(item.manualClass),
  Type: safeText(item.type),

  pricePerUnit: safeNum(item.pricePerUnit),
  minPricePerUnit: safeNum(item.minPricePerUnit),
  minPromotionPrice: safeNum(item.minPromotionPrice),

  StockReal: safeNum(item.stockReal),
  StockShow: safeNum(item.stockShow),
  stock_หักจอง: "ยังไม่รู้",
  StockClearance: safeNum(item.stockClearance),

  YN_Best_2025: safeText(item.best2025),
  สถานะTrade: safeText(item.tradeStatus),
  RemarkTrade: safeText(item.RemarkTrade),
  SuggestionPurchasing: safeNum(item.productSuggestion),

  DayOnHand_DOH: safeNum(item.DOH),
  DayOnHand_DOH_Stock2: safeNum(item.DOHStock),
  
  KeyRemarks: item.KeyRemarks || [],
  location: safeText(item.location),
});

/**
 * useTradeProducts
 * - ใช้ API /api/products/query (ผ่าน API_BASE_URL + /products/query)
 * - รองรับ server-side pagination (page, perPage)
 * - ส่ง filters + search ไปให้ backend ดึงข้อมูล
 * - ใช้ /api/products/summary เพื่อดึงตัวเลขสรุป (ไม่ต้องโหลด fullData เอง)
 */
export function useTradeProducts({
  page = 1,
  perPage = 20,
  filters = {},
  search = "",
} = {}) {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [uniqueBrands, setUniqueBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [reloadKey, setReloadKey] = useState(0); // ใช้ trigger reload หลังอัปเดตสถานะ

  const token = getToken();

  
  // ============================================================
  //  ดึงข้อมูลตามหน้า (server-side pagination + filters + search)
  // ============================================================
  useEffect(() => {
    let cancelled = false;

    const loadPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const filtersParam = buildFiltersParam(filters);

        const params = new URLSearchParams();
        params.set("fields", "*");
        if (filtersParam) params.set("filters", filtersParam);
        params.set("per_page", String(perPage));
        params.set("page", String(page));

        const trimmedSearch = (search || "").trim();
        if (trimmedSearch) {
          params.set("search", trimmedSearch);
          params.set("searchFields", "itemCode,brand,Description");
          params.set("searchMode", "contains"); // แบบ A
        }

        const url = `${API_BASE_URL}/products/query?${params.toString()}`;

        const res = await authFetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "1",
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (cancelled) return;

        setTotalPages(json.total_pages || 1);
        setTotalItems(json.total || 0);

        const rows = json.data || [];
        const mapped = rows.map(mapTradeRow);
        setData(mapped);
      } catch (err) {
        if (!cancelled) {
          console.error("❌ Trade Hook Error:", err);
          setError(err.message ?? String(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    perPage,
    filters.class,
    filters.brand,
    filters.tradeStatus,
    filters.set,
    filters.best2025,
    filters.location,
    search,
    reloadKey,
    token,
  ]);
  // ============================================================
  //  ฟังก์ชัน: updateTradeStatus → ยิง API แล้ว reload หน้า
  // ============================================================
  const updateTradeStatus = async (itemCode, newStatus) => {
    const form = new FormData();
    form.append("itemCode", itemCode);
    form.append("tradeStatus", newStatus);

    await authFetch(`${API_BASE_URL}/products/update-trade-status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "1",
      },
      body: form,
    });

    // trigger reload page
    setReloadKey((k) => k + 1);
  };

  // ============================================================
  //  ฟังก์ชัน: loadSummary → ใช้ /api/products/summary
  //  (เรียกจาก component เวลา filters/search เปลี่ยน)
  // ============================================================
  const loadSummary = async (filtersForSummary = {}, searchForSummary = "") => {
    try {
      const filtersParam = buildFiltersParam(filtersForSummary);

      const params = new URLSearchParams();
      if (filtersParam) params.set("filters", filtersParam);

      const trimmedSearch = (searchForSummary || "").trim();
      if (trimmedSearch) {
        params.set("search", trimmedSearch);
        params.set("searchFields", "itemCode,brand,Description");
        params.set("searchMode", "contains");
      }

      const url = `${API_BASE_URL}/products/summary?${params.toString()}`;

      const res = await authFetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "1",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setSummary(json.summary || null);
    } catch (err) {
      console.error("❌ loadSummary error:", err);
      setSummary(null);
    }
  };
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/products/brands`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "1",
          },
        });

        const json = await res.json();
        setUniqueBrands(json.brands || []);
      } catch (err) {
        console.error("Load brands failed:", err);
        setUniqueBrands([]);
      }
    };

    loadBrands();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/trade-status");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.action === "trade-status-updated") {
        setData((prev) =>
          prev.map((it) =>
            it.Code === msg.itemCode
              ? { ...it, สถานะTrade: msg.tradeStatus }
              : it
          )
        );
      }
    };

    ws.onclose = () => console.log("TradeStatus WS closed");
    ws.onerror = (e) => console.log("TradeStatus WS error", e);

    return () => ws.close();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/trade-status");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // 1) อัปเดตสถานะ Trade
      if (msg.action === "trade-status-updated") {
        setData((prev) =>
          prev.map((it) =>
            it.Code === msg.itemCode
              ? { ...it, สถานะTrade: msg.tradeStatus }
              : it
          )
        );
      }

      // 2) อัปเดต Remark ล่าสุด + จำนวนทั้งหมด
      if (msg.action === "trade-remark-updated") {
        setData((prev) =>
          prev.map((it) =>
            it.Code === msg.itemCode
              ? {
                  ...it,
                  RemarkTrade: msg.lastRemark,
                  RemarkCount: msg.totalRemarks,
                }
              : it
          )
        );
      }
    };

    return () => ws.close();
  }, []);

  return {
    data,
    loading,
    error,
    totalPages,
    totalItems,
    updateTradeStatus,
    summary,
    loadSummary,
    uniqueBrands,
  };
}
