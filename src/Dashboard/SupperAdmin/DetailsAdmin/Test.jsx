import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Test() {
  const token = import.meta.env.VITE_API_TOKEN;

  // 🔹 โหมดกราฟ (total หรือ class)
  const [mode, setMode] = useState("class");
  // 🔹 class ที่เลือก (ใช้เมื่อ mode = class)
  const [selectedClass, setSelectedClass] = useState("A");
  // 🔹 จำนวนที่ต้องการแสดง
  const [displayCount, setDisplayCount] = useState(25);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // โหลดข้อมูลใหม่เมื่อ mode / class เปลี่ยน
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "";

        if (mode === "class") {
          // ดึงเฉพาะคลาสที่เลือก
          url = `/api/product/search?page=1&offset=5000&columns=manualClass|${selectedClass}`;
        } else {
          // ดึงทั้งหมด (ทุกคลาส)
          url = `/api/product/search?page=1&offset=5000&columns=manualClass|%`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const text = await res.text();
        if (!text) throw new Error("Response body is empty");
        const json = JSON.parse(text);

        const raw = json?.result?.data || [];

        // ถ้าเป็น total → รวมยอดตามคลาส
        if (mode === "total") {
          const grouped = raw.reduce((acc, cur) => {
            const key = cur.manualClass || "ไม่ระบุ";
            if (!acc[key]) {
              acc[key] = {
                name: `Class ${key}`,
                avgSale: 0,
                cutOff: 0,
                cutOffSet: 0,
                count: 0,
              };
            }
            acc[key].avgSale += Number(cur.avgSaleOutPerMonth) || 0;
            acc[key].cutOff += Number(cur.amountCutOff) || 0;
            acc[key].cutOffSet +=
              Number(cur.amountCutOffSet || cur.amountSet) || 0;
            acc[key].count++;
            return acc;
          }, {});
          setData(Object.values(grouped));
        } else {
          // class → ใช้ข้อมูลตรง ๆ ของคลาสที่เลือก
          setData(raw);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mode, selectedClass, token]);

  // ✅ เตรียมข้อมูลกราฟ
  const chartData = data.map((d) => ({
    name: d.name || d.Description || d.itemCode,
    avgSale: Number(d.avgSaleOutPerMonth || d.avgSale) || 0,
    cutOff: Number(d.amountCutOff || d.cutOff) || 0,
    cutOffSet:
      Number(d.amountCutOffSet || d.amountSet || d.cutOffSet) || 0,
  }));

  const handleClassChange = (e) => setSelectedClass(e.target.value);
  const handleModeChange = (e) => setMode(e.target.value);
  const handleCountChange = (e) =>
    setDisplayCount(e.target.value === "all" ? "all" : Number(e.target.value));

  const shownData =
    displayCount === "all" ? chartData : chartData.slice(0, displayCount);

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          📊 กราฟยอดขายสินค้า{" "}
          {mode === "class"
            ? `Class ${selectedClass}`
            : "(เปรียบเทียบแต่ละคลาส)"}
        </h1>

        <div className="flex gap-3">
          {/* 🔘 ปุ่มเลือกโหมด */}
          <select
            value={mode}
            onChange={handleModeChange}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:border-pink-700"
          >
            <option value="class">class</option>
            <option value="total">total</option>
          </select>

          {/* 🔘 เลือกคลาส (ใช้เฉพาะตอน class) */}
          {mode === "class" && (
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:border-pink-700"
            >
              <option value="A">Class A</option>
              <option value="B">Class B</option>
              <option value="C">Class C</option>
              <option value="D">Class D</option>
            </select>
          )}

          {/* 🔘 เลือกจำนวนที่จะแสดง */}
          <select
            onChange={handleCountChange}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:border-pink-700"
          >
            <option value="10">10 รายการ</option>
            <option value="20">20 รายการ</option>
            <option value="50">50 รายการ</option>
            <option value="100">100 รายการ</option>
            <option value="all">ทั้งหมด</option>
          </select>
        </div>
      </div>

      {loading && <p className="p-6">กำลังโหลดข้อมูล...</p>}
      {error && (
        <p className="p-6 text-red-500">เกิดข้อผิดพลาด: {error.message}</p>
      )}

      {!loading && !error && shownData.length === 0 && (
        <p className="text-gray-500">
          ไม่พบข้อมูลสินค้าใน{" "}
          {mode === "class" ? `Class ${selectedClass}` : "ทุกคลาส"}
        </p>
      )}

      {!loading && shownData.length > 0 && (
        <ResponsiveContainer width="100%" height={520}>
          <BarChart
            data={shownData}
            margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
            cellBackground
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgSale" fill="#4ade80" name="ยอดขายเฉลี่ย/เดือน" />
            <Bar dataKey="cutOff" fill="#60a5fa" name="ยอดขายเดี่ยว" />
            <Bar dataKey="cutOffSet" fill="#facc15" name="ยอดขายชุดเซ็ต" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
