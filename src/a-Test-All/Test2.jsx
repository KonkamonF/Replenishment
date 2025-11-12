import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from "recharts";

/* ============================================================================
 * MockDashboardFinal.jsx
 * ครบตามสเปก 13 ข้อ + ข้อมูลจำลอง 50 รายการ
 * - โหมด total/class + เลือกช่วงวันที่
 * - DataTable สไตล์ #640037, shadow-xl, hover-pink
 * - Bar & Radar อิง "ข้อมูลจาก DataTable ที่กำลังแสดงอยู่" จริงๆ (รวม pagination)
 * - total: รวมยอดรายคลาส + toggle เปิด/ปิดการแสดงผลแต่ละคลาส
 * - class: เลือกคลาส/ทุกคลาส, page size ปรับได้, sort ตาม 4 ตัวเลือก
 * - ปิดแถว -> เก็บใน localStorage, มี modal จัดการเปิดคืน
 * - modal รายละเอียดสินค้า -> Radar เทียบกับสินค้าที่อยู่ใน set เดียวกัน
 * ============================================================================ */

const CLASSES = ["A", "B", "C", "D"];
const CLASS_TO_SCORE = { A: 4, B: 3, C: 2, D: 1 };
const CLASS_BADGE = (c) => (c === "A" ? "bg-orange-500" : "bg-pink-500");

const SERIES_COLORS = {
  single: "#3b82f6", // ฟ้า
  setSale: "#f59e0b", // เหลือง
};

const CLASS_COLORS = {
  A: "#ef4444", // ใช้สำหรับ Cell (ถ้าต้องแสดงสีต่อแถว)
  B: "#3b82f6",
  C: "#22c55e",
  D: "#f59e0b",
};

const RADAR_PALETTE = [
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#22c55e",
  "#14b8a6",
];

const SORT_KEYS = [
  { value: "autoClassSingle", label: "autoclassเดี่ยว" },
  { value: "manualClassSingle", label: "manualclassเดี่ยว" },
  { value: "autoClassSet", label: "autoclassเซ็ต" },
  { value: "manualClassSet", label: "manualclassเซ็ต" },
];

const dateToInput = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const parseInputDate = (s) => {
  const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
  return new Date(y, m - 1, d, 0, 0, 0, 0);
};
const rnd = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
const randDateWithin = (daysBack = 150) => {
  const now = new Date();
  const from = new Date();
  from.setDate(now.getDate() - daysBack);
  return new Date(rnd(from.getTime(), now.getTime()));
};

function useMockData() {
  const [data] = useState(() => {
    const items = [];
    const setIds = ["SET-1001", "SET-1002", "SET-1003", "SET-1004", "SET-1005"];
    for (let i = 1; i <= 50; i++) {
      const autoS = CLASSES[rnd(0, 3)];
      const manS = CLASSES[rnd(0, 3)];
      const autoT = CLASSES[rnd(0, 3)];
      const manT = CLASSES[rnd(0, 3)];
      items.push({
        id: `P-${String(i).padStart(3, "0")}`,
        itemCode: `SKU-${1000 + i}`,
        name: `สินค้าทดลอง ${i}`,
        autoClassSingle: autoS,
        manualClassSingle: manS,
        autoClassSet: autoT,
        manualClassSet: manT,
        manualClass: manS, // class หลักอิง manual เดี่ยว
        amountCutOff: rnd(0, 1200), // ยอดเดี่ยว
        amountCutOffSet: rnd(0, 800), // ยอดเซ็ต
        itemSetCode: setIds[i % setIds.length],
        updatedAt: randDateWithin(150),
      });
    }
    return items;
  });
  return data;
}

function useHiddenStorage(key = "mock_hidden_products") {
  const [hidden, setHidden] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify([...hidden]));
    } catch {}
  }, [hidden, key]);

  const hide = (id) => setHidden((s) => new Set([...s, id]));
  const unhide = (id) => setHidden((s) => (s.delete(id), new Set([...s])));
  const clearAll = () => setHidden(new Set());

  return { hidden, hide, unhide, clearAll };
}

export default function Test2() {
  const allData = useMockData();

  // ------- Controls -------
  const [mode, setMode] = useState("class"); // 'total' | 'class'
  const [view, setView] = useState("table"); // 'table' | 'bar' | 'radar'
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [sortKey, setSortKey] = useState(SORT_KEYS[1].value);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const today = useMemo(() => new Date(), []);
  const defaultStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d;
  }, []);
  const [startDate, setStartDate] = useState(dateToInput(defaultStart));
  const [endDate, setEndDate] = useState(dateToInput(today));

  // ------- Hidden rows -------
  const { hidden, hide, unhide, clearAll } = useHiddenStorage();
  const [manageOpen, setManageOpen] = useState(false);

  // ------- Detail modal -------
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  // ------- Total: toggle class visibility -------
  const [classShown, setClassShown] = useState({
    A: true,
    B: true,
    C: true,
    D: true,
  });
  const toggleClassShown = (c) =>
    setClassShown((prev) => ({ ...prev, [c]: !prev[c] }));

  // ------- Base filtering (date + hidden) -------
  const baseFiltered = useMemo(() => {
    const s = parseInputDate(startDate);
    const e = parseInputDate(endDate);
    e.setHours(23, 59, 59, 999);
    return allData.filter(
      (d) => !hidden.has(d.id) && d.updatedAt >= s && d.updatedAt <= e
    );
  }, [allData, hidden, startDate, endDate]);

  // ------- TOTAL rows: group by manualClass -------
  const totalRowsAll = useMemo(() => {
    const group = {};
    for (const it of baseFiltered) {
      const k = it.manualClass ?? "D";
      if (!group[k]) group[k] = { className: k, single: 0, setSale: 0 };
      group[k].single += it.amountCutOff;
      group[k].setSale += it.amountCutOffSet;
    }
    return Object.values(group).sort(
      (a, b) =>
        (CLASS_TO_SCORE[b.className] ?? 0) - (CLASS_TO_SCORE[a.className] ?? 0)
    );
  }, [baseFiltered]);

  // Apply classShown to total rows for table & chart
  const totalRowsShown = useMemo(
    () => totalRowsAll.filter((r) => classShown[r.className]),
    [totalRowsAll, classShown]
  );

  // ------- CLASS rows (filter by class + sort) -------
  const classRowsAll = useMemo(() => {
    let rows =
      selectedClass === "ALL"
        ? baseFiltered
        : baseFiltered.filter((d) => d.manualClass === selectedClass);

    // sort: A มาก่อน D; ถ้าเท่ากันเรียงยอดเดี่ยวมาก→น้อย
    rows = [...rows].sort((a, b) => {
      const aC = a[sortKey] || "D";
      const bC = b[sortKey] || "D";
      const diff = (CLASS_TO_SCORE[aC] ?? 0) - (CLASS_TO_SCORE[bC] ?? 0);
      if (diff !== 0) return -diff;
      return b.amountCutOff - a.amountCutOff;
    });

    return rows;
  }, [baseFiltered, selectedClass, sortKey]);

  // Pagination ใช้เฉพาะตอน table (เพื่อให้ “กราฟอิงตารางที่กำลังแสดง” → ใช้หน้าเดียวกัน)
  const classRowsPaged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return classRowsAll.slice(start, start + pageSize);
  }, [classRowsAll, page, pageSize]);

  useEffect(
    () => setPage(1),
    [mode, selectedClass, sortKey, pageSize, startDate, endDate]
  );

  const totalPages =
    mode === "class"
      ? Math.max(1, Math.ceil(classRowsAll.length / pageSize))
      : 1;

  // ========== จุดสำคัญ: ชุดข้อมูลของ "ตารางที่กำลังแสดงอยู่" ==========
  // เพื่อให้ Bar/Radar อิงกับ datatable จริง:
  // - โหมด total → ใช้ totalRowsShown
  // - โหมด class → ใช้ classRowsPaged (หน้าเดียวกับตาราง)
  const activeTableRows = useMemo(
    () => (mode === "total" ? totalRowsShown : classRowsPaged),
    [mode, totalRowsShown, classRowsPaged]
  );

  // -------------------- BAR CHART (อิง activeTableRows) --------------------
  const barData = useMemo(() => {
    if (mode === "total") {
      return activeTableRows.map((r) => ({
        x: `Class ${r.className}`,
        single: r.single,
        setSale: r.setSale,
        _class: r.className,
      }));
    }
    return activeTableRows.map((d) => ({
      x: d.name,
      single: d.amountCutOff,
      setSale: d.amountCutOffSet,
      _class: d.manualClass,
    }));
  }, [activeTableRows, mode]);

  // -------------------- RADAR CHART (อิง activeTableRows) --------------------
  const radarSubjects = [
    { key: "single", label: "ยอดขายเดี่ยว" },
    { key: "setSale", label: "ยอดขายเซ็ต" },
    { key: "manSingle", label: "manualclassเดี่ยว" },
    { key: "manSet", label: "manualclassเซ็ต" },
  ];

  const [radarIds, setRadarIds] = useState([]);
  // ตั้งค่าเริ่มของ series ใน Radar ตาม activeTableRows (สูงสุด 5)
  useEffect(() => {
    if (mode === "total") {
      setRadarIds(activeTableRows.slice(0, 5).map((r) => `C-${r.className}`));
    } else {
      setRadarIds(activeTableRows.slice(0, 5).map((d) => d.id));
    }
  }, [mode, activeTableRows]);

  const radarSeries = useMemo(() => {
    if (mode === "total") {
      return activeTableRows
        .map((r) => ({
          id: `C-${r.className}`,
          name: `Class ${r.className}`,
          points: [
            { subject: radarSubjects[0].label, value: r.single },
            { subject: radarSubjects[1].label, value: r.setSale },
            {
              subject: radarSubjects[2].label,
              value: CLASS_TO_SCORE[r.className] ?? 0,
            },
            {
              subject: radarSubjects[3].label,
              value: CLASS_TO_SCORE[r.className] ?? 0,
            },
          ],
        }))
        .filter((s) => radarIds.includes(s.id));
    }
    return activeTableRows
      .map((d) => ({
        id: d.id,
        name: d.name,
        points: [
          { subject: radarSubjects[0].label, value: d.amountCutOff },
          { subject: radarSubjects[1].label, value: d.amountCutOffSet },
          {
            subject: radarSubjects[2].label,
            value: CLASS_TO_SCORE[d.manualClassSingle] ?? 0,
          },
          {
            subject: radarSubjects[3].label,
            value: CLASS_TO_SCORE[d.manualClassSet] ?? 0,
          },
        ],
      }))
      .filter((s) => radarIds.includes(s.id));
  }, [mode, activeTableRows, radarIds]);

  // -------------------- DETAIL MODAL (Radar เทียบสินค้าใน set เดียวกัน) --------------------
  const detailItem = useMemo(
    () => baseFiltered.find((x) => x.id === detailId) || null,
    [baseFiltered, detailId]
  );
  const detailPeers = useMemo(() => {
    if (!detailItem) return [];
    return baseFiltered.filter(
      (d) => d.itemSetCode === detailItem.itemSetCode && d.id !== detailItem.id
    );
  }, [baseFiltered, detailItem]);

  const [detailRadarIds, setDetailRadarIds] = useState([]);
  useEffect(() => {
    if (!detailItem) return;
    const ids = [detailItem, ...detailPeers].slice(0, 6).map((x) => x.id);
    setDetailRadarIds(ids);
  }, [detailItem, detailPeers]);

  const detailSeries = useMemo(() => {
    const pool = detailItem ? [detailItem, ...detailPeers] : [];
    return pool
      .filter((p) => detailRadarIds.includes(p.id))
      .map((d) => ({
        id: d.id,
        name: d.name,
        points: [
          { subject: radarSubjects[0].label, value: d.amountCutOff },
          { subject: radarSubjects[1].label, value: d.amountCutOffSet },
          {
            subject: radarSubjects[2].label,
            value: CLASS_TO_SCORE[d.manualClassSingle] ?? 0,
          },
          {
            subject: radarSubjects[3].label,
            value: CLASS_TO_SCORE[d.manualClassSet] ?? 0,
          },
        ],
      }));
  }, [detailItem, detailPeers, detailRadarIds]);

  // -------------------- Render --------------------
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Mock Test
          </h1>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          {/* โหมด */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">โหมดข้อมูล</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="p-2 border rounded-lg focus:border-pink-700"
            >
              <option value="total">total</option>
              <option value="class">class</option>
            </select>
          </div>

          {/* วันที่ */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">วันที่เริ่มต้น</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">วันที่สิ้นสุด</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>

          {/* class / sort / page size */}
          {mode === "class" && (
            <>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">
                  เลือก class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="ALL">ทุก class</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">sort ตาม</label>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  {SORT_KEYS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {view === "table" && (
                <>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">
                      แสดงต่อหน้า
                    </label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="p-2 border rounded-lg"
                    >
                      {[10, 20, 50, 100].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <input
                      type="number"
                      className="p-2 border rounded-lg w-24"
                      placeholder="กรอกจำนวน"
                      min={1}
                      onBlur={(e) => {
                        const v = Math.max(1, Number(e.target.value || "0"));
                        setPageSize(v);
                      }}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* View switch */}
          <div className="flex gap-1">
            {["table", "bar", "radar"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2 rounded-lg border ${
                  view === v ? "bg-[#640037] text-white" : "bg-white"
                }`}
                title={`แสดงเป็น ${v}`}
              >
                {v === "table" ? "DataTable" : v === "bar" ? "Bar" : "Radar"}
              </button>
            ))}
          </div>

          {/* จัดการรายการที่ซ่อน */}
          <button
            onClick={() => setManageOpen(true)}
            className="px-3 py-2 rounded-lg border hover:bg-gray-50"
          >
            จัดการการแสดงผล
          </button>
        </div>
      </div>

      {/* -------------------- Controls เฉพาะ total -------------------- */}
      {mode === "total" && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-600">เลือกคลาสที่จะแสดง:</span>
          {CLASSES.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={classShown[c]}
                onChange={() => toggleClassShown(c)}
              />
              <span>Class {c}</span>
            </label>
          ))}
        </div>
      )}

      {/* -------------------- DataTable -------------------- */}
      {view === "table" && (
        <>
          {mode === "total" ? (
            <TotalTable rows={totalRowsShown} />
          ) : (
            <ClassTable
              rows={classRowsPaged}
              fullCount={classRowsAll.length}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              setPage={setPage}
              onHideRow={(id) => hide(id)}
              onViewDetail={(id) => {
                setDetailId(id);
                setDetailOpen(true);
              }}
            />
          )}
        </>
      )}

      {/* -------------------- Bar Chart (อิง activeTableRows) -------------------- */}
      {view === "bar" && (
        <div className="overflow-hidden shadow-xl rounded-xl border border-gray-200 p-3">
          <div className="h-[520px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="setSale" fill="#facc15" name="ยอดขายเซ็ต">
                  {barData.map((row, i) => (
                    <Cell key={`t-${i}`} fill={SERIES_COLORS.setSale} />
                  ))}
                </Bar>
                <Bar dataKey="single" fill="#60a5fa" name="ยอดขายเดี่ยว">
                  {barData.map((row, i) => (
                    <Cell key={`s-${i}`} fill={SERIES_COLORS.single} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * กราฟนี้อ้างอิงข้อมูลเดียวกับ DataTable ที่กำลังแสดง
            (รวมหน้า/การกรอง)
          </p>
        </div>
      )}

      {/* -------------------- Radar Chart (อิง activeTableRows) -------------------- */}
      {view === "radar" &&
        (() => {
          // รวมข้อมูลจาก datatable เป็น single data array
          const mergedRadarData = radarSubjects.map((subj) => {
            const row = { subject: subj.label };
            activeTableRows.forEach((d) => {
              const key = mode === "total" ? `Class ${d.className}` : d.name;
              if (subj.key === "single")
                row[key] = d.amountCutOff ?? d.single ?? 0;
              else if (subj.key === "setSale")
                row[key] = d.amountCutOffSet ?? d.setSale ?? 0;
              else if (subj.key === "manSingle") {
                const cls =
                  mode === "total" ? d.className : d.manualClassSingle;
                row[key] = CLASS_TO_SCORE[cls] ?? 0;
              } else if (subj.key === "manSet") {
                const cls = mode === "total" ? d.className : d.manualClassSet;
                row[key] = CLASS_TO_SCORE[cls] ?? 0;
              }
            });
            return row;
          });

          // ✅ รายชื่อ series (ชื่อสินค้า หรือ class)
          const seriesKeys =
            mode === "total"
              ? activeTableRows.map((r) => `Class ${r.className}`)
              : activeTableRows.map((d) => d.name);

          // ✅ กรองตาม checkbox
          const visibleSeries = seriesKeys.filter((key) =>
            radarIds.includes(
              mode === "total"
                ? `C-${key.split(" ")[1]}`
                : activeTableRows.find((d) => d.name === key)?.id
            )
          );

          return (
            <div className="overflow-hidden shadow-xl rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="text-sm text-gray-700">
                เลือกรายการที่ต้องการแสดงใน Radar (สูงสุด ~8):
              </div>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-auto">
                {seriesKeys.map((key, idx) => {
                  const id =
                    mode === "total"
                      ? `C-${key.split(" ")[1]}`
                      : activeTableRows[idx]?.id;
                  return (
                    <label
                      key={id}
                      className="text-xs flex items-center gap-1 px-2 py-1 rounded border"
                    >
                      <input
                        type="checkbox"
                        checked={radarIds.includes(id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRadarIds((prev) =>
                              [...new Set([...prev, id])].slice(0, 8)
                            );
                          } else {
                            setRadarIds((prev) => prev.filter((x) => x !== id));
                          }
                        }}
                      />
                      {key}
                    </label>
                  );
                })}
              </div>

              <div className="h-[520px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    data={mergedRadarData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Tooltip />
                    <Legend />
                    {visibleSeries.map((name, idx) => (
                      <Radar
                        key={name}
                        name={name}
                        dataKey={name}
                        stroke={RADAR_PALETTE[idx % RADAR_PALETTE.length]}
                        fill={RADAR_PALETTE[idx % RADAR_PALETTE.length]}
                        fillOpacity={0.25}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500">
                * Radar แสดง 4 แกน: ยอดขายเดี่ยว, ยอดขายเซ็ต, manualclassเดี่ยว,
                manualclassเซ็ต
              </p>
            </div>
          );
        })()}

      {/* -------------------- Manage Hidden Modal -------------------- */}
      {manageOpen && (
        <Modal title="จัดการการแสดงผล" onClose={() => setManageOpen(false)}>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              มีรายการถูกปิดการแสดงผลอยู่ {hidden.size} รายการ
            </p>
            <div className="flex gap-2 flex-wrap">
              {[...hidden].map((id) => {
                const item = allData.find((x) => x.id === id);
                if (!item) return null;
                return (
                  <div
                    key={id}
                    className="px-3 py-2 rounded-lg border flex items-center gap-3"
                  >
                    <div className="text-sm">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-500 text-xs">
                        {item.itemCode}
                      </div>
                    </div>
                    <button
                      onClick={() => unhide(id)}
                      className="px-2 py-1 text-xs rounded-lg border hover:bg-gray-50"
                    >
                      นำกลับมาแสดง
                    </button>
                  </div>
                );
              })}
            </div>
            {hidden.size > 0 && (
              <button
                onClick={clearAll}
                className="px-3 py-2 rounded-lg border hover:bg-gray-50"
              >
                เปิดแสดงทั้งหมด
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* -------------------- Product Detail Modal (Radar in set) -------------------- */}
      {detailOpen && detailItem && (
        <Modal
          title={`รายละเอียดสินค้า: ${detailItem.name}`}
          onClose={() => setDetailOpen(false)}
        >
          <div className="space-y-3">
            <div className="text-sm text-gray-700">
              <div>
                รหัส: <span className="font-mono">{detailItem.itemCode}</span>
              </div>
              <div>Class หลัก: {detailItem.manualClass}</div>
              <div>ชุดเซ็ต: {detailItem.itemSetCode}</div>
            </div>

            <div className="text-sm text-gray-700">
              เลือกสินค้าเปรียบเทียบ (ในเซ็ตเดียวกัน):
            </div>
            <div className="flex flex-wrap gap-2">
              {[detailItem, ...detailPeers].map((it) => (
                <label
                  key={it.id}
                  className="text-xs flex items-center gap-1 px-2 py-1 rounded border"
                >
                  <input
                    type="checkbox"
                    checked={detailRadarIds.includes(it.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDetailRadarIds((prev) =>
                          [...new Set([...prev, it.id])].slice(0, 8)
                        );
                      } else {
                        setDetailRadarIds((prev) =>
                          prev.filter((x) => x !== it.id)
                        );
                      }
                    }}
                  />
                  {it.name}
                </label>
              ))}
            </div>

            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                {(() => {
                  // รวมข้อมูลจากสินค้าในเซ็ตเดียวกัน
                  const mergedDetailData = radarSubjects.map((subj) => {
                    const row = { subject: subj.label };
                    [detailItem, ...detailPeers].forEach((d) => {
                      if (!detailRadarIds.includes(d.id)) return;
                      const key = d.name;
                      if (subj.key === "single") row[key] = d.amountCutOff;
                      else if (subj.key === "setSale")
                        row[key] = d.amountCutOffSet;
                      else if (subj.key === "manSingle")
                        row[key] = CLASS_TO_SCORE[d.manualClassSingle] ?? 0;
                      else if (subj.key === "manSet")
                        row[key] = CLASS_TO_SCORE[d.manualClassSet] ?? 0;
                    });
                    return row;
                  });

                  // series ที่ต้องแสดง
                  const visibleKeys = [detailItem, ...detailPeers]
                    .filter((d) => detailRadarIds.includes(d.id))
                    .map((d) => d.name);

                  return (
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="75%"
                      data={mergedDetailData}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      <Tooltip />
                      <Legend />
                      {visibleKeys.map((name, idx) => (
                        <Radar
                          key={name}
                          name={name}
                          dataKey={name}
                          stroke={RADAR_PALETTE[idx % RADAR_PALETTE.length]}
                          fill={RADAR_PALETTE[idx % RADAR_PALETTE.length]}
                          fillOpacity={0.25}
                        />
                      ))}
                    </RadarChart>
                  );
                })()}
              </ResponsiveContainer>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== Sub Components ============================== */

function TotalTable({ rows }) {
  return (
    <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
      <table className="min-w-full table-auto bg-white text-center">
        <thead className="bg-[#640037] text-white sticky top-0 text-sm">
          <tr>
            <th className="p-3 min-w-[50px]">No.</th>
            <th className="p-3 min-w-[120px] border-l border-gray-500/30">
              ชื่อ class
            </th>
            <th className="p-3 min-w-[120px] border-l border-gray-500/30">
              ยอดขายเดี่ยว
            </th>
            <th className="p-3 min-w-[120px] border-l border-gray-500/30">
              ยอดขายเซ็ต
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="p-6 text-gray-500" colSpan={4}>
                ไม่พบข้อมูลในช่วงวันที่ที่เลือก
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => (
              <tr
                key={r.className}
                className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
              >
                <td className="p-3">{idx + 1}</td>
                <td className="p-3 font-semibold text-gray-700">
                  <span
                    className={`px-2 py-0.5 rounded-full text-white text-xs font-semibold ${CLASS_BADGE(
                      r.className
                    )}`}
                  >
                    Class {r.className}
                  </span>
                </td>
                <td className="p-3 font-bold text-right text-blue-600">
                  {r.single.toLocaleString()}
                </td>
                <td className="p-3 font-bold text-right text-orange-600">
                  {r.setSale.toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ClassTable({
  rows,
  fullCount,
  page,
  pageSize,
  totalPages,
  setPage,
  onHideRow,
  onViewDetail,
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">
        แสดง {rows.length.toLocaleString()} จากทั้งหมด{" "}
        {fullCount.toLocaleString()} รายการ
      </div>

      <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
        <table className="min-w-full table-auto bg-white text-center">
          <thead className="bg-[#640037] text-white sticky top-0 text-sm">
            <tr>
              <th className="p-3 min-w-[50px]">No.</th>
              <th className="p-3 min-w-[120px] border-l border-gray-500/30">
                รหัสสินค้า
              </th>
              <th className="p-3 min-w-[200px] border-l border-gray-500/30">
                ชื่อสินค้า
              </th>
              <th className="p-3 min-w-[120px] border-l border-gray-500/30">
                ยอดขายเดี่ยว
              </th>
              <th className="p-3 min-w-[120px] border-l border-gray-500/30">
                ยอดขายเซ็ต
              </th>
              <th className="p-3 min-w-[140px] border-l border-gray-500/30">
                autoclassเดี่ยว
              </th>
              <th className="p-3 min-w-[160px] border-l border-gray-500/30">
                manualclassเดี่ยว
              </th>
              <th className="p-3 min-w-[140px] border-l border-gray-500/30">
                autoclassเซ็ต
              </th>
              <th className="p-3 min-w-[160px] border-l border-gray-500/30">
                manualclassเซ็ต
              </th>
              <th className="p-3 min-w-[160px] border-l border-gray-500/30">
                การทำงาน
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="p-6 text-gray-500" colSpan={10}>
                  ไม่พบข้อมูลในหน้าปัจจุบัน
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
                >
                  <td className="p-3">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="p-3 font-mono text-sm text-left">
                    <span className="font-bold text-[#640037] block">
                      {r.itemCode}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-700 text-left">
                    {r.name}
                  </td>
                  <td className="p-3 font-extrabold text-right text-blue-600">
                    {r.amountCutOff.toLocaleString()}
                  </td>
                  <td className="p-3 font-extrabold text-right text-orange-600">
                    {r.amountCutOffSet.toLocaleString()}
                  </td>
                  <td className="p-3">Class {r.autoClassSingle}</td>
                  <td className="p-3">
                    <span
                      className={`ml-1 text-xs font-semibold text-white px-2 py-0.5 rounded-full inline-block ${CLASS_BADGE(
                        r.manualClassSingle
                      )}`}
                    >
                      Class {r.manualClassSingle}
                    </span>
                  </td>
                  <td className="p-3">Class {r.autoClassSet}</td>
                  <td className="p-3">
                    <span
                      className={`ml-1 text-xs font-semibold text-white px-2 py-0.5 rounded-full inline-block ${CLASS_BADGE(
                        r.manualClassSet
                      )}`}
                    >
                      Class {r.manualClassSet}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 text-xs rounded-lg border hover:bg-gray-50"
                        onClick={() => onViewDetail(r.id)}
                        title="ดูสินค้าแบบ Radar เทียบในเซ็ตเดียวกัน"
                      >
                        ดู
                      </button>
                      <button
                        className="px-3 py-1 text-xs rounded-lg border hover:bg-gray-50"
                        onClick={() => onHideRow(r.id)}
                        title="ปิดการแสดงผลรายการนี้"
                      >
                        ปิดแสดง
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          className="px-3 py-2 rounded-lg border disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          ก่อนหน้า
        </button>
        <div className="text-sm">
          หน้า {page} / {totalPages}
        </div>
        <button
          className="px-3 py-2 rounded-lg border disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- Modal --------------------------------- */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="px-3 py-1 rounded-lg border hover:bg-gray-50"
            onClick={onClose}
          >
            ปิด
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
