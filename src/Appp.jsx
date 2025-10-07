import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Side from "./SideBar/Side";

export default function Appp() {
  // 1. State เพื่อจัดการสถานะการเปิด-ปิด/ยุบ-ขยาย Sidebar
  // true = เปิด/ขยาย, false = ปิด/ยุบ
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. ฟังก์ชันสำหรับสลับสถานะ
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // กำหนดความกว้างของ Sidebar
  const sidebarWidth = "200px";

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* --- Header / Navigation Bar --- */}
      {/* Header ถูกปรับให้มี z-index สูงและลอยอยู่เหนือทุกอย่าง */}
      <header className="bg-white shadow-md h-[64px] flex items-center px-6 z-20 sticky top-0 border-b border-pink-100">
        {/* Sidebar Toggle Button (แสดงตลอดเวลาใน Header) */}
        <button
          onClick={toggleSidebar}
          className="text-[#640037] p-2 rounded-md hover:bg-pink-50 mr-4 transition-colors"
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {/* ใช้ Icon ตามสถานะ: เปิดใช้ลูกศรซ้าย, ปิดใช้เมนู */}
          {isSidebarOpen ? (
            // Icon ลูกศรชี้ซ้าย (สำหรับยุบ/ปิด)
           <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 23"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          ) : (
            // Icon เมนู (สำหรับเปิด/ขยาย)
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 23"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          )}
        </button>

        {/* Logo / System Title */}
        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
          <svg
            className="w-8 h-8 text-[#640037]"
            /* ... (SVG Path เดิม) ... */
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0l2.583 3m-2.583-3h11.834m-7.667 0h-4M10 17h4"
            ></path>
          </svg>
          <span className="text-xl font-bold text-[#640037]">
            Replenishment System
          </span>
        </Link>

        {/* User Profile / Notifications */}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="text-sm text-gray-500 hidden sm:block">
            Welcome, Admin User
          </div>
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#640037] font-semibold cursor-pointer border-2 border-pink-300">
            AD
          </div>
        </div>
      </header>

      {/* --- Main Layout: Sidebar and Content --- */}
      {/* ใช้ Flexbox จัดเรียง Sidebar และ Content */}
      <div className="flex relative">
        {/* Sidebar: ใช้ Sticky เพื่ออยู่ติดด้านบน และใช้ Transition จัดการการเปิด-ปิด */}
        <div
          className="bg-white shadow-lg pt-4 transition-all duration-300 ease-in-out sticky top-16" // top-16 = 64px (ความสูง Header)
          style={{
            width: isSidebarOpen ? sidebarWidth : "0", // ควบคุมความกว้าง
            minHeight: "calc(100vh - 64px)", // ความสูงเต็มหน้าจอ ลบความสูง Header
            overflow: "hidden", // ซ่อนเนื้อหาเมื่อยุบ
          }}
        >
          {/* Side Component ถูกห่อด้วย div เพื่อป้องกันการย่อขนาด */}
          <div style={{ width: sidebarWidth }}>
            <Side />
          </div>
        </div>

        {/* Main Content Area (ขยายเต็มพื้นที่ที่เหลือ) */}
        <main className="p-6 flex-1 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
