import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Side from "./SideBar/Side";
import sbo from "../src/assets/sbo.png";

export default function Appp() {
  // 1. State เพื่อจัดการสถานะการเปิด-ปิด/ยุบ-ขยาย Sidebar
  // true = เปิด/ขยาย, false = ปิด/ยุบ
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. ฟังก์ชันสำหรับสลับสถานะ
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // กำหนดความกว้างของ Sidebar
  const sidebarWidth = "250px";

  return (
    <>
      <div className="bg-gray-200 min-h-screen">
        {/* --- Header / Navigation Bar --- */}
        {/* Header ถูกปรับให้มี z-index สูงและลอยอยู่เหนือทุกอย่าง */}
        <header className="bg-white shadow-md h-[64px] flex items-center px-6 z-20 sticky top-0 border-b border-pink-100">
          {/* Sidebar Toggle Button (แสดงตลอดเวลาใน Header) */}
          <button
            onClick={toggleSidebar}
            className="text-[#640037] p-2 rounded-md hover:bg-pink-100 mr-4 transition-colors cursor-pointer"
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
          <Link to="/" className="flex items-center space-x-4 cursor-pointer">
            <img src={sbo} alt="" className="w-16"/>
            <span className="text-xl font-bold text-[#640037]">
              Replenishment System
            </span>
          </Link>

          {/* User Profile / Notifications */}
          <div className="flex items-center space-x-4 ml-auto">
            <div className="text-sm text-gray-500 ">Welcome, Admin User</div>
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#640037] font-semibold cursor-pointer border-2 border-pink-900">
              AD
            </div>
          </div>
        </header>

        {/* --- Main Layout: Sidebar and Content --- */}
        {/* ใช้ Flexbox จัดเรียง Sidebar และ Content */}
        <div className="flex">
          {/* Sidebar: ใช้ Sticky เพื่ออยู่ติดด้านบน และใช้ Transition จัดการการเปิด-ปิด */}
          <div
            className="bg-white shadow-lg pt-4  sticky top-16" // top-16 = 64px (ความสูง Header)
            style={{
              width: isSidebarOpen ? sidebarWidth : "0", // ควบคุมความกว้าง
              minHeight: "calc(100vh - 64px)", // ความสูงเต็มหน้าจอ ลบความสูง Header
            }}
          >
            {/* Side Component ถูกห่อด้วย div เพื่อป้องกันการย่อขนาด */}
            <div
              style={{
                width: isSidebarOpen ? sidebarWidth : "0",
                overflow: "hidden",
              }}
            >
              <Side />
            </div>
          </div>

          {/* Main Content Area (ขยายเต็มพื้นที่ที่เหลือ) */}
          <main className="p-6 flex-1 max-w-full overflow-scroll">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
