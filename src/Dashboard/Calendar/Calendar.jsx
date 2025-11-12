import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EntryProductDate from "../../SideBar-Modal/StockModal/EntryProductDate";
import { useProductEntry } from "../../hooks/useProductEntry";

export default function Calendar() {
  // ✅ แยก state ออกเป็นสองชุดที่ถูกต้อง
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpenEntryProductDate, setIsEntryProductDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const token = import.meta.env.VITE_API_TOKEN;

  // ✅ ได้ monthEntries มาจาก hook แล้ว
  const { data, monthEntries, loading, error, fetchByDate, prefetchMonth, setMonthEntries } = useProductEntry(token);
  useEffect(() => {
    // ✅ สร้าง WebSocket
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/entry-updates");

    // ws.onopen = () => console.log("✅ WebSocket connected");
    // ws.onclose = () => console.log("❌ WebSocket disconnected");

    // ✅ เมื่อมีการอัปเดตจากเครื่องอื่น
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Realtime update:", data);

        // ✅ อัปเดตสถานะใน monthEntries โดยไม่ต้อง reload
        setMonthEntries((prev) =>
          prev.map((x) =>
            x.id === data.id ? { ...x, status: data.status } : x
          )
        );
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    // ✅ ปิดเมื่อ component ถูก unmount
    return () => ws.close();
  }, []);

  // ✅ โหลดทั้งเดือนทันที และเมื่อเปลี่ยนเดือน
  useEffect(() => {
    prefetchMonth(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate.getFullYear(), currentDate.getMonth(), prefetchMonth]);

  // Helper
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getHeaderDate = (date) =>
    date.toLocaleString("th-TH", { month: "long", year: "numeric" });

  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  const handlePrevMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );

  const handleNextMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  const handleDateClick = (year, month, day) => {
    const selected = { year, month, day };
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    setSelectedDate(selected);
    fetchByDate(dateStr); // ดึงข้อมูลของวันนั้นไว้เข้า modal
    setIsEntryProductDate(true);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = getDaysInMonth(currentDate);
  const firstDayIndex = getFirstDayOfMonth(currentDate);

  const weekdays = [
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
    "อาทิตย์",
  ];

  return (
    <>
      {/* Modal */}
      {isOpenEntryProductDate && (
        <EntryProductDate
          setIsEntryProductDate={setIsEntryProductDate}
          selectedDate={selectedDate}
          entries={data} // รายการของ "วัน" ที่เลือก
          loading={loading}
          fetchByDate={fetchByDate}
        />
      )}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-['Inter']">
        <h2 className="text-4xl mb-4">กำหนดสินค้าเข้า</h2>

        <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 border-t-4 border-pink-600">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-3 border-b">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full text-[#640037] hover:bg-indigo-50 transition duration-150 transform hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-wide">
              {getHeaderDate(currentDate)}
            </h2>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full text-[#640037] hover:bg-indigo-50 transition duration-110 transform hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
            {weekdays.map((day) => (
              <div
                key={day}
                className="font-bold text-sm sm:text-base text-[#640037] py-2 border-b-2 border-pink-100"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-16"></div>
            ))}

            {Array.from({ length: numDays }).map((_, i) => {
              const day = i + 1;
              const dateKey = `${year}-${String(month + 1).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;

              // ✅ ใช้ monthEntries (ดึงทั้งเดือนไว้แล้ว) แสดงผลทันที
              const dayEntries = monthEntries.filter(
                (e) => e.entryDate === dateKey
              );
              const countF = dayEntries.filter((e) => e.status === "F").length;
              const countT = dayEntries.filter((e) => e.status === "T").length;

              const bgColor =
                countF > 0 && countT === 0
                  ? "bg-red-100 text-red-700"
                  : countT > 0 && countF === 0
                  ? "bg-green-100 text-green-700"
                  : countF > 0 && countT > 0
                  ? "bg-yellow-100 text-yellow-700"
                  : "";

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => handleDateClick(year, month, day)}
                  className={`h-16 flex flex-col items-center justify-start p-1 text-sm rounded-lg cursor-pointer transition
                    ${bgColor}
                  `}
                >
                  <span className="w-7 h-7 flex items-center justify-center rounded-full">
                    {day}
                  </span>

                  {dayEntries.length > 0 && (
                    <div className="mt-1 w-full text-xs font-medium truncate">
                      {dayEntries.length} รายการ
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            ปฏิทินเริ่มต้นที่วันจันทร์
          </div>
        </div>
      </div>
    </>
  );
}
