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

  // ✅ state สำหรับเก็บ class ที่เลือก
  const [selectedClass, setSelectedClass] = useState("A");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ โหลดข้อมูลเมื่อ selectedClass เปลี่ยน
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/product/search?page=1&offset=50&columns=manualClass|${selectedClass}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const text = await res.text();
        if (!text) throw new Error("Response body is empty");
        const json = JSON.parse(text);

        setData(json?.result?.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedClass, token]); // 🔁 refetch เมื่อ class เปลี่ยน

  // ✅ เตรียมข้อมูลกราฟ
  const chartData = data.map((d) => ({
    name: d.Description || d.itemCode,
    avgSale: Number(d.avgSaleOutPerMonth) || 0,
    cutOff: Number(d.amountCutOff) || 0,
    cutOffSet: Number(d.amountCutOffSet || d.amountSet) || 0,
  }));

  // ✅ handle การเปลี่ยนค่า select
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        📊 กราฟยอดขายสินค้า Class {selectedClass}
      </h1>

      <div className="flex justify-end gap-2 mb-6">
        <select
          value={selectedClass}
          onChange={handleClassChange}
          className="p-2.5 pr-20 border border-gray-300 focus:border-pink-700 focus:ring-pink-700 shadow-sm
                     hover:bg-amber-50 cursor-pointer rounded-lg"
        >
          <option value="A">Class A</option>
          <option value="B">Class B</option>
          <option value="C">Class C</option>
          <option value="D">Class D</option>
        </select>
      </div>

      {loading && <p className="p-6">กำลังโหลดข้อมูล...</p>}
      {error && <p className="p-6 text-red-500">เกิดข้อผิดพลาด: {error.message}</p>}

      {!loading && !error && chartData.length === 0 && (
        <p className="text-gray-500">ไม่พบข้อมูลสินค้าใน Class {selectedClass}</p>
      )}

      {!loading && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={520}>
          <BarChart
            data={chartData.slice(0, 25)}
            margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
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
