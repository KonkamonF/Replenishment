import { useState, useEffect } from "react";
import { API_BASE_URL, API_TOKEN } from "../config/apiConfig";

export function useTradeCommunication(itemCode) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const token = API_TOKEN;

  // โหลดประวัติ
  const fetchHistory = async () => {
    if (!itemCode) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/trade/action/${itemCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "1",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setHistory(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [itemCode]);

  // ================================
  // อัปเดต TradeStatus จริงในสินค้าหลัก
  // ================================
  const updateTradeStatus = async (itemCode, newStatus) => {
    const form = new FormData();
    form.append("itemCode", itemCode);
    form.append("tradeStatus", newStatus);

    const res = await fetch(`${API_BASE_URL}/products/update-trade-status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "1",
      },
      body: form,
    });

    if (!res.ok) throw new Error(`Update TradeStatus HTTP ${res.status}`);
  };

  // ================================
  // บันทึก Action + อัปเดตสถานะ
  // ================================
  const saveAction = async ({ oldStatus, newStatus, remark, images }) => {
    setSaving(true);
    try {
      // --- 1) บันทึก Action ---
      const form = new FormData();
      form.append("itemCode", itemCode);
      form.append("oldStatus", oldStatus || "");
      form.append("newStatus", newStatus || "");
      form.append("remark", remark);

      if (images?.length > 0) {
        images.forEach((file) => form.append("images", file));
      }

      const res = await fetch(`${API_BASE_URL}/trade/action`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "1",
        },
        body: form,
      });

      if (!res.ok) throw new Error(`Action HTTP ${res.status}`);

      // --- 2) อัปเดต tradeStatus จริง ---
      await updateTradeStatus(itemCode, newStatus);

      // --- 3) โหลดประวัติใหม่ ---
      await fetchHistory();

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    history,
    loading,
    saving,
    error,
    fetchHistory,
    saveAction,
  };
}
