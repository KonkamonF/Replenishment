import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EntryProductDate from "../StockModal/EntryProductDate";

// คอมโพเนนต์หลักของปฏิทิน
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpenEntryProductDate, setIsEntryProductDate] = useState(false);

  // ADDED: State สำหรับเก็บข้อมูล (events)
  const [events, setEvents] = useState({
    "2025-11-25": "สินค้าทดลองเข้า", // ตัวอย่างข้อมูลเริ่มต้น
  });

  // --- Helper Functions ---

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    
    // FIXED: แก้ไข Logic ครับ
    // ถ้า getDay() = 0 (อาทิตย์) ให้คืนค่า 6 (Index สุดท้าย)
    // ถ้า getDay() = 1 (จันทร์) ให้คืนค่า 0 (Index แรก)
    // ...
    // โค้ดเดิมคือ return day === 0 ? 6 : day;
    return day === 0 ? 6 : day - 1; // 0=จันทร์, 6=อาทิตย์
  };

  const getHeaderDate = (date) => {
    return date.toLocaleString("th-TH", {
      month: "long",
      year: "numeric",
    });
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  // --- Navigation Handlers ---

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // --- CHANGED: อัปเดต Function ---
  // เปลี่ยนจากการเรียก window.prompt เป็นการเปิด Modal
  const handleDateClick = (year, month, day) => {
    
    // นี่คือส่วนที่เปลี่ยนครับ
    setIsEntryProductDate(true);
  };

  // --- Rendering Logic ---

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = getDaysInMonth(currentDate);
  const firstDayIndex = getFirstDayOfMonth(currentDate);

  // FIXED: แก้ไขการเรียงลำดับวัน
  // ต้องเริ่มที่ "จันทร์" และจบที่ "อาทิตย์"
  // เพื่อให้ตรงกับ Logic ของ getFirstDayOfMonth (ที่คืนค่า 0=จันทร์, 6=อาทิตย์)
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
      {isOpenEntryProductDate && (
        <EntryProductDate setIsEntryProductDate={setIsEntryProductDate} />
      )}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-['Inter']">
        <script src="https://cdn.tailwindcss.com"></script>

        <h2 className="text-4xl mb-4">กำหนดสินค้าเข้า</h2>
        <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 border-t-4 border-pink-600">
          {/* Calendar Header and Navigation */}
          <div className="flex justify-between items-center mb-6 pb-3 border-b">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition duration-150 transform hover:scale-105"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-wide">
              {getHeaderDate(currentDate)}
            </h2>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition duration-110 transform hover:scale-105"
              aria-label="Next Month"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
            {/* Render Weekdays Header */}
            {weekdays.map((day) => (
              <div
                key={day}
                className="font-bold text-sm sm:text-base text-indigo-600 py-2 border-b-2 border-indigo-100"
              >
                {day}
              </div>
            ))}

            {/* Render blank cells */}
            {Array.from({ length: firstDayIndex }).map((_, index) => (
              <div key={`blank-${index}`} className="h-16"></div>
            ))}

            {/* Render the days of the month */}
            {Array.from({ length: numDays }).map((_, index) => {
              const day = index + 1;
              const isCurrentDay = isToday(year, month, day);
              const dateKey = `${year}-${String(month + 1).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;
              const dayEvent = events[dateKey];

              return (
                <div
                  key={`day-${day}`}
                  // onClick นี้จะเรียก handleDateClick ที่เราแก้ไขแล้ว
                  onClick={() => handleDateClick(year, month, day)} 
                  className={`
                        h-16 w-full flex flex-col items-center justify-start p-1 text-sm rounded-lg cursor-pointer transition duration-150
                        ${
                          isCurrentDay
                            ? "bg-pink-100 text-pink-700 font-bold"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                >
                  {/* แสดงเลขวันที่ */}
                  <span
                    className={`w-7 h-7 flex items-center justify-center rounded-full ${
                      isCurrentDay ? "" : "hover:bg-gray-200"
                    }`}
                  >
                    {day}
                  </span>

                  {/* แสดงข้อมูล event ถ้ามี */}
                  {dayEvent && (
                    <div
                      className="mt-1 w-full text-xs text-indigo-700 font-medium truncate"
                      title={dayEvent}
                    >
                      {dayEvent}
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