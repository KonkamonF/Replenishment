// src/hooks/useTradeProducts.js
import { useState, useEffect } from "react";
import { API_BASE_URL, API_TOKEN } from "../config/apiConfig";

// ---------- Helpers ----------
const safeNum = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeText = (v) => {
  if (v === null || v === undefined || v === "") return "NDB";
  return v;
};

/**
 * useTradeProducts
 * - ใช้ API /api/products/query
 * - รองรับ server-side pagination (page, perPage)
 * - ส่ง filters ไป API เฉพาะอันที่เลือก (class/brand/tradeStatus/set/best2025)
 * - ไม่ส่ง search ไป API (search ทำฝั่ง UI)
 */
export function useTradeProducts({ page = 1, perPage = 20, filters = {} }) {
  const [data, setData] = useState([]);
  // เก็บข้อมูลทั้งหมดตาม filter (ใช้สำหรับ summary)
  const [fullData, setFullData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = API_TOKEN;

  // ============================================================
  //  ฟังก์ชัน load() — ย้ายออกมาจาก useEffect เดิมแบบไม่แตะของเดิม
  // ============================================================
  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      // -------------------------
      // Build filters param
      // -------------------------
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

      const filtersParam = parts.join(",");

      const params = new URLSearchParams();
      params.set("fields", "*");
      if (filtersParam) params.set("filters", filtersParam);
      params.set("per_page", String(perPage));
      params.set("page", String(page));

      const url = `${API_BASE_URL}/products/query?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "1",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setTotalPages(json.total_pages || 1);
      setTotalItems(json.total || 0);

      const rows = json.data || [];

      // -------------------------
      // Mapping ให้ตรงกับ UI Trade
      // -------------------------
      const mapped = rows.map((item) => ({
        ...item,

        Code: safeText(item.itemCode),
        Brand: safeText(item.brand),
        Description: safeText(item.Description ?? item.description),
        Class: safeText(item.manualClass),
        Type: safeText(item.type),

        Stock_จบเหลือจริง: safeNum(item.stockReal ?? item.stockAllStore),

        YN_Best_2025: safeText(item.best2025),
        สถานะTrade: safeText(item.tradeStatus),
        RemarkTrade: safeText(item.tradeRemark),
        SuggestionPurchasing: safeNum(item.productSuggestion),

        DayOnHand_DOH: safeNum(item.DOH),
        DayOnHand_DOH_Stock2: safeNum(item.DOHStock),

        KeyRemarks: item.KeyRemarks || [],
      }));

      setData(mapped);
    } catch (err) {
      console.error("❌ Trade Hook Error:", err);
      setError(err.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  //  useEffect เดิมของคุณ — ไม่แตะ ไม่ลบ ไม่แก้
  // ============================================================
  useEffect(() => {
    let cancelled = false;

    const loadInside = async () => {
      try {
        setLoading(true);
        setError(null);

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

        const filtersParam = parts.join(",");

        const params = new URLSearchParams();
        params.set("fields", "*");
        if (filtersParam) params.set("filters", filtersParam);
        params.set("per_page", String(perPage));
        params.set("page", String(page));

        const url = `${API_BASE_URL}/products/query?${params.toString()}`;

        const res = await fetch(url, {
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

        const mapped = rows.map((item) => ({
          ...item,
          Code: safeText(item.itemCode),
          Brand: safeText(item.brand),
          Description: safeText(item.Description ?? item.description),
          Class: safeText(item.manualClass),
          Type: safeText(item.type),
          Stock_จบเหลือจริง: safeNum(item.stockReal ?? item.stockAllStore),
          YN_Best_2025: safeText(item.best2025),
          สถานะTrade: safeText(item.tradeStatus),
          RemarkTrade: safeText(item.tradeRemark),
          SuggestionPurchasing: safeNum(item.productSuggestion),
          DayOnHand_DOH: safeNum(item.DOH),
          DayOnHand_DOH_Stock2: safeNum(item.DOHStock),
          KeyRemarks: item.KeyRemarks || [],
        }));

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

    loadInside();

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
  ]);

  // ============================================================
  //  ฟังก์ชันใหม่: updateTradeStatus
  // ============================================================
  const updateTradeStatus = async (itemCode, newStatus) => {
    const form = new FormData();
    form.append("itemCode", itemCode);
    form.append("tradeStatus", newStatus);

    await fetch(`${API_BASE_URL}/products/update-trade-status`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      body: form,
    });

    //  refresh โดยใช้ load() ใหม่ (ไม่ยุ่งกับ useEffect เดิม)
    await load();
  };

  // // โหลดข้อมูลทั้งหมดตาม filter (เพื่อ summary dashboard)
  const loadFullData = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.set("fields", "*");
      params.set("per_page", "5000");
      params.set("page", "1");

      // ---- apply filters ให้เหมือน load() ----
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

      const filtersParam = parts.join(",");
      if (filtersParam) params.set("filters", filtersParam);

      // ---- call API ----
      const url = `${API_BASE_URL}/products/query?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "1",
        },
      });

      const json = await res.json();
      const rows = json.data || [];

      // ---- mapping ----
      const mapped = rows.map((item) => ({
        ...item,
        Code: item.itemCode ?? "NDB",
        Brand: item.brand ?? "NDB",
        Description: item.Description ?? item.description ?? "NDB",
        Class: item.manualClass ?? "NDB",
        Type: item.type ?? "NDB",
        Stock_จบเหลือจริง: Number(item.stockReal ?? item.stockAllStore ?? 0),
        YN_Best_2025: item.best2025 ?? "",
        สถานะTrade: item.tradeStatus ?? "NDB",
        RemarkTrade: item.tradeRemark ?? "",
        SuggestionPurchasing: Number(item.productSuggestion ?? 0),
        DayOnHand_DOH: Number(item.DOH ?? 0),
        DayOnHand_DOH_Stock2: Number(item.DOHStock ?? 0),
        KeyRemarks: item.KeyRemarks || [],
      }));

      setFullData(mapped);
    } catch (err) {
      console.error("❌ loadFullData summary error:", err);
      setFullData([]);
    }
  };
  const loadSummary = async (filters = {}) => {
    try {
      const params = new URLSearchParams();

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

      const filtersParam = parts.join(",");
      if (filtersParam) params.set("filters", filtersParam);

      const url = `${API_BASE_URL}/products/summary?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "1",
        },
      });

      const json = await res.json();

      setSummary(json.summary);

    } catch (err) {
      console.error("❌ loadSummary error:", err);
      setSummary({});
    }
  };


  // ============================================================
  //  return ค่าออกไปใช้ (เพิ่ม updateTradeStatus อย่างเดียว)
  // ============================================================
  return {
    data,
    loading,
    error,
    totalPages,
    totalItems,
    updateTradeStatus, // ← เพิ่มตรงนี้อย่างเดียว
    fullData, // เพิ่ม state
    loadFullData, // ฟังก์ชันใหม่
    loadSummary,
  };
}
