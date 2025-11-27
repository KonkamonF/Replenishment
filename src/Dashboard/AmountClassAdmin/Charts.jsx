import React from "react";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { useMonthlySalesSummary } from "../../hooks/useMonthlySalesSummary";

const Charts = () => {
  const { data: chartData, loading, error } = useMonthlySalesSummary();

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
    );

  if (error)
    return (
      <div className="h-96 flex items-center justify-center text-red-600">
         เกิดข้อผิดพลาด: {error}
      </div>
    );

  if (!chartData.length)
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
        ไม่มีข้อมูลยอดขายในระบบ
      </div>
    );

  const maxActual = Math.max(...chartData.map((d) => d["ยอดขายจริง (หน่วย)"] || 0));
  const maxTarget = Math.max(...chartData.map((d) => d["ยอดขายเป้าหมาย (หน่วย)"] || 0));
  const maxDomain = Math.ceil(Math.max(maxActual, maxTarget) / 10) * 10;

  return (
    <div className="h-96 w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        แนวโน้มยอดขายจริงเทียบเป้าหมาย (รายเดือน)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#f0f0f0" />
          <PolarAngleAxis dataKey="name" stroke="#640037" className="text-xs" />
          <PolarRadiusAxis domain={[0, maxDomain]} angle={90} stroke="#640037" className="text-xs" />

          <Tooltip
            formatter={(value, name) => [value.toLocaleString(), name]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "12px",
            }}
          />

          <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />

          <Radar
            name="ยอดขายจริง (หน่วย)"
            dataKey="ยอดขายจริง (หน่วย)"
            stroke="#00bcd4"
            fill="#00bcd4"
            fillOpacity={0.3}
            strokeWidth={3}
          />
          <Radar
            name="ยอดขายเป้าหมาย (หน่วย)"
            dataKey="ยอดขายเป้าหมาย (หน่วย)"
            stroke="#ff9800"
            fill="#ff9800"
            fillOpacity={0.3}
            strokeWidth={3}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 text-start mt-4 ">
        *Target Sale คือค่าประมาณการเฉลี่ยรายเดือน
      </p>
    </div>
  );
};

export default Charts;
