// src/hooks/useKeyProducts.js
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

const mapKeyRow = (item) => {
  const latestRemark =
    item.lastRemark ??          // ← ใช้จาก backend ใหม่ก่อน
    item.traderemark ??
    item.RemarkTrade ??
    (item.KeyRemarks?.length > 0
      ? item.KeyRemarks[item.KeyRemarks.length - 1].remark
      : null) ??
    "NDB";

  const remarkCount =
    item.totalRemarks ??        // ← ใช้จำนวนจาก backend
    item.RemarkCount ??
    (item.KeyRemarks?.length || 0);


  return {
    raw: item,
    Code: safeText(item.itemcode),
    Brand: safeText(item.brand),
    Description: safeText(item.description),
    Class: safeText(item.manualclass),
    Type: safeText(item.type),
    SubType: safeText(item.section),

    // ยังไม่มี best2025 ใน DB → ให้ No ไปก่อน
    YN_Best_2025: "No",

    Stock_จบเหลือจริง: safeNum(item.stockreal),
    Stock_Show_Calc: safeNum(item.stockshow),
    DayOnHand_DOH_Stock2: safeNum(item.dohstock),
    DayOnHand_DOH: safeNum(item.doh),

    SaleOutNow: safeNum(item.avgsaleoutpermonth),

    สถานะTrade: safeText(item.tradestatus),
    RemarkTrade: safeText(latestRemark),

    KeyRemarks: item.KeyRemarks || [],
    RemarkCount: remarkCount,
  };
};

/**
 * useKeyProducts
 * - ใช้ API:
 *   - GET /api/key/products/query    → data + pagination + channels + keyUsers
 *   - GET /api/key/products/summary  → dashboard summary
 *   - GET /api/key/products/filters  → dropdown options
 */
export function useKeyProducts({
  filters = {},
  isSuperAdmin = false,
  page = 1,
  perPage = 50,
} = {}) {
  const [data, setData] = useState([]);
  const [channels, setChannels] = useState([]);
  const [keyUsers, setKeyUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [summary, setSummary] = useState({
    totalSkus: 0,
    totalStock: 0,
    avgDohWeighted: 0,
    abnormalCount: 0,
  });

  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    classes: [],
    tradeStatuses: [],
    sets: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = getToken();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // ---------- common filter params ----------
        const makeFilterParams = () => {
          const params = new URLSearchParams();

          const trimmedSearch = (filters.search || "").trim();
          if (trimmedSearch) params.set("search", trimmedSearch);

          if (filters.brand && filters.brand !== "All") {
            params.set("brand", filters.brand);
          }
          if (filters.class && filters.class !== "All") {
            params.set("manualClass", filters.class);
          }
          if (filters.tradeStatus && filters.tradeStatus !== "All") {
            params.set("tradeStatus", filters.tradeStatus);
          }
          if (filters.set && filters.set !== "All") {
            params.set("set", filters.set);
          }
          if (filters.best2025 && filters.best2025 !== "All") {
            // ตอนนี้ backend ยังไม่รองรับ best2025 ก็ข้ามไปได้
            // params.set("best2025", filters.best2025);
          }

          if (filters.salesChannelId && filters.salesChannelId !== "All") {
            params.set("sales_channel_id", String(filters.salesChannelId));
          }

          if (isSuperAdmin && filters.keyUsername && filters.keyUsername !== "All") {
            params.set("key_username", filters.keyUsername);
          }

          if (filters.showUnassigned) {
            params.set("no_key_only", "1");
          }

          return params;
        };

        // --- query params (มี page/per_page) ---
        const queryParams = makeFilterParams();
        queryParams.set("page", String(page));
        queryParams.set("per_page", String(perPage));

        // --- summary ใช้ filter เต็ม แต่ไม่มี page/per_page ---
        const summaryParams = makeFilterParams();

        // --- filters ใช้เฉพาะ scope: channel/key/no_key ---
        const filtersParams = new URLSearchParams();
        if (filters.salesChannelId && filters.salesChannelId !== "All") {
          filtersParams.set("sales_channel_id", String(filters.salesChannelId));
        }
        if (isSuperAdmin && filters.keyUsername && filters.keyUsername !== "All") {
          filtersParams.set("key_username", filters.keyUsername);
        }
        if (filters.showUnassigned) {
          filtersParams.set("no_key_only", "1");
        }

        const headers = {
          Authorization: `Bearer ${token || API_TOKEN}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "1",
        };

        const queryUrl = `${API_BASE_URL}/key/products/query?${queryParams.toString()}`;
        const summaryUrl = `${API_BASE_URL}/key/products/summary?${summaryParams.toString()}`;
        const filtersUrl = `${API_BASE_URL}/key/products/filters?${filtersParams.toString()}`;

        const [resQuery, resSummary, resFilters] = await Promise.all([
          authFetch(queryUrl, { headers }),
          authFetch(summaryUrl, { headers }),
          authFetch(filtersUrl, { headers }),
        ]);

        if (!resQuery.ok) {
          throw new Error(`Query HTTP ${resQuery.status}`);
        }
        if (!resSummary.ok) {
          throw new Error(`Summary HTTP ${resSummary.status}`);
        }
        if (!resFilters.ok) {
          throw new Error(`Filters HTTP ${resFilters.status}`);
        }

        const [jsonQuery, jsonSummary, jsonFilters] = await Promise.all([
          resQuery.json(),
          resSummary.json(),
          resFilters.json(),
        ]);

        if (cancelled) return;

        // data
        const rows = jsonQuery.data || [];
        const mapped = rows.map(mapKeyRow);
        setData(mapped);
        setTotalItems(jsonQuery.total || mapped.length);
        setTotalPages(jsonQuery.total_pages || 1);
        setChannels(jsonQuery.channels || []);
        setKeyUsers(jsonQuery.keyUsers || []);

        // summary
        setSummary({
          totalSkus: jsonSummary.totalSkus ?? 0,
          totalStock: jsonSummary.totalStock ?? 0,
          avgDohWeighted: jsonSummary.avgDohWeighted ?? 0,
          abnormalCount: jsonSummary.abnormalCount ?? 0,
        });

        // filter options
        setFilterOptions({
          brands: jsonFilters.brands || [],
          classes: jsonFilters.classes || [],
          tradeStatuses: jsonFilters.tradeStatuses || [],
          sets: jsonFilters.sets || [],
        });
      } catch (err) {
        if (!cancelled) {
          console.error("❌ useKeyProducts error:", err);
          setError(err.message ?? String(err));
          setData([]);
          setChannels([]);
          setKeyUsers([]);
          setTotalItems(0);
          setTotalPages(1);
          setSummary({
            totalSkus: 0,
            totalStock: 0,
            avgDohWeighted: 0,
            abnormalCount: 0,
          });
          setFilterOptions({
            brands: [],
            classes: [],
            tradeStatuses: [],
            sets: [],
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    token,
    isSuperAdmin,
    page,
    perPage,
    filters.search,
    filters.brand,
    filters.class,
    filters.tradeStatus,
    filters.set,
    filters.best2025,
    filters.salesChannelId,
    filters.keyUsername,
    filters.showUnassigned,
  ]);

  // WebSocket: sync สถานะ / remark สด
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

    ws.onclose = () => console.log("KeyProducts WS closed");
    ws.onerror = (e) => console.log("KeyProducts WS error", e);

    return () => ws.close();
  }, []);

  return {
    data,
    loading,
    error,
    totalItems,
    totalPages,
    channels,
    keyUsers,
    summary,
    filterOptions,
  };
}
