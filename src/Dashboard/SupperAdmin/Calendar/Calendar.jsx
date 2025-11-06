import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ตัวช่วยสำหรับกำหนดสีและขนาด
const PRIMARY_COLOR = 'indigo';

// คอมโพเนนต์หลักของปฏิทิน
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- Helper Functions ---

  // 1. หาจำนวนวันในเดือน
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // 2. หาว่าวันที่ 1 ของเดือนตรงกับวันอะไร (0=อาทิตย์, 1=จันทร์, ..., 6=เสาร์)
  const getFirstDayOfMonth = (date) => {
    // getDay() เริ่มที่ 0 (อาทิตย์). เราต้องให้วันจันทร์เป็นวันแรกของสัปดาห์ (1) 
    // เพื่อให้เข้ากับ Array ['จันทร์', 'อังคาร', ...] ที่เราสร้าง
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // ปรับ Sunday (0) ให้เป็น 6, และวันอื่น ๆ (1-6) ให้เป็น day-1
    return day === 0 ? 6 : day - 1; // 0=จันทร์, 6=อาทิตย์ (เพื่อให้ Grid เริ่มที่วันจันทร์)
  };

  // 3. จัดรูปแบบวันที่ปัจจุบันที่แสดงใน Header
  const getHeaderDate = (date) => {
    return date.toLocaleDateString('th-TH', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // 4. ตรวจสอบว่าวันที่ที่กำหนดเป็นวันนี้หรือไม่
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
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return newDate;
    });
  };

  // --- Rendering Logic ---

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = getDaysInMonth(currentDate);
  const firstDayIndex = getFirstDayOfMonth(currentDate);
  
  // วันในสัปดาห์ (เริ่มที่จันทร์)
  const weekdays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];


  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-['Inter']">
        <script src="https://cdn.tailwindcss.com"></script>
        
        <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 border-t-4 border-pink-600">
            
            {/* Calendar Header and Navigation */}
            <div className="flex justify-between items-center mb-6 pb-3 border-b">
                <button 
                    onClick={handlePrevMonth}
                    className={`p-2 rounded-full text-${PRIMARY_COLOR}-600 hover:bg-${PRIMARY_COLOR}-50 transition duration-150 transform hover:scale-105`}
                    aria-label="Previous Month"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-wide">
                    {getHeaderDate(currentDate)}
                </h2>
                
                <button 
                    onClick={handleNextMonth}
                    className={`p-2 rounded-full text-${PRIMARY_COLOR}-600 hover:bg-${PRIMARY_COLOR}-50 transition duration-150 transform hover:scale-105`}
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
                        className={`font-bold text-sm sm:text-base text-${PRIMARY_COLOR}-600 py-2 border-b-2 border-${PRIMARY_COLOR}-100`}
                    >
                        {day}
                    </div>
                ))}

                {/* Render blank cells for days before the 1st */}
                {/* Note: The length is derived from the calculated firstDayIndex (0=Mon) */}
                {Array.from({ length: firstDayIndex }).map((_, index) => (
                    <div key={`blank-${index}`} className="h-12 flex items-center justify-center text-gray-400"></div>
                ))}

                {/* Render the days of the month */}
                {Array.from({ length: numDays }).map((_, index) => {
                    const day = index + 1;
                    const isCurrentDay = isToday(year, month, day);

                    return (
                        <div 
                            key={`day-${day}`} 
                            className={`
                                h-12 w-full flex items-center justify-center text-lg font-medium rounded-full cursor-pointer transition duration-150 
                                ${isCurrentDay 
                                    ? `bg-${PRIMARY_COLOR}-600 text-pink-900 bg-pink-100 shadow-lg shadow-${PRIMARY_COLOR}-300/50 transform scale-105` 
                                    : 'text-gray-700 hover:bg-gray-100'
                                }
                            `}
                        >
                            {day}
                        </div>
                    );
                })}

            </div>
            
            {/* Footer space */}
            <div className="mt-8 text-center text-sm text-gray-400">
                ปฏิทินเริ่มต้นที่วันจันทร์
            </div>
        </div>
    </div>
  );
}