// 1. เปลี่ยน import จาก Link เป็น NavLink
import { NavLink } from "react-router-dom";

// กำหนด base class สำหรับลิงก์
const baseClass =
  "p-3 w-full text-left transition duration-150 ease-in-out block font-medium tracking-wide";
// กำหนด class สำหรับ hover
const hoverClass = "hover:bg-gray-300 hover:text-[#640037]";
// กำหนด class สำหรับสีหลัก (Active)
const activeClass = "text-[#640037] bg-gray-200 "; // ใช้สีหลัก
// กำหนด class สำหรับสีปกติ (Inactive)
const inactiveClass = "text-gray-700 rounded-r-lg";

export default function Side() {
  // 3. สร้างฟังก์ชันสำหรับจัดการ className
  //    NavLink จะส่ง object ที่มี { isActive } มาให้
  const getNavLinkClass = ({ isActive }) => {
    return `${baseClass} ${hoverClass} rounded-l-full p-2 ml-5 ${
      isActive ? activeClass : inactiveClass
    }`;
  };

  return (
    // Padding ด้านข้าง 4 (1rem)
    <div className="flex flex-col py-4">
      {/* Super Admin / Dashboard */}
      {/* 2. เปลี่ยน <Link> เป็น <NavLink> */}
      <NavLink
        to="/"
        className={getNavLinkClass} // 4. ใช้ฟังก์ชันที่สร้างไว้
      >
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          </svg>
          <span>Dashboard</span>
        </div>
      </NavLink>

      {/* Trade Admin / Order Approval */}
      <NavLink
        to="/trade-admin"
        className={getNavLinkClass} // 4. ใช้ฟังก์ชันเดียวกัน
      >
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5h6"
            ></path>
          </svg>
          <span>Trade</span>
        </div>
      </NavLink>

      {/* Key ACC Admin / Product Management */}
      <NavLink
        to="/key-admin"
        className={getNavLinkClass} // 4. ใช้ฟังก์ชันเดียวกัน
      >
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-8-4l8 4m0-10l8 4m-8-4v10"
            ></path>
          </svg>
          <span>Key Account</span>
        </div>
      </NavLink>

      {/* Key Forecast */}
      <NavLink
        to="/key-fc"
        className={getNavLinkClass} // 4. ใช้ฟังก์ชันเดียวกัน
      >
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-8-4l8 4m0-10l8 4m-8-4v10"
            ></path>
          </svg>
          <span>Key Forecast</span>
        </div>
      </NavLink>
    </div>
  );
}
