import { Link } from "react-router-dom";

// กำหนด base class สำหรับลิงก์
const baseClass =
  "p-3 w-full text-left transition duration-150 ease-in-out block font-medium tracking-wide";
// กำหนด class สำหรับ hover
const hoverClass = "hover:bg-pink-100 hover:text-pink-800";
// กำหนด class สำหรับสีหลัก
const activeClass = "text-[#640037]"; // ใช้สีหลัก

export default function Side() {
  return (
    // Padding ด้านข้าง 4 (1rem) เพื่อไม่ให้เมนูชิดขอบซ้ายจนเกินไป
    <div className="flex flex-col space-y-1 px-4">
      {/* Super Admin / Dashboard */}
      <Link
        to="/"
        className={`${baseClass} ${activeClass} ${hoverClass} rounded-lg`} // ให้เมนูนี้เป็นเมนูเริ่มต้น (Active)
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
      </Link>

      {/* Trade Admin / Order Approval */}
      <Link
        to="/trade-admin"
        className={`${baseClass} text-gray-700 ${hoverClass} rounded-lg`}
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
      </Link>

      {/* Key ACC Admin / Product Management */}
      <Link
        to="/key-admin"
        className={`${baseClass} text-gray-700 ${hoverClass} rounded-lg`}
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
      </Link>
      <Link
        to="/key-fc"
        className={`${baseClass} text-gray-700 ${hoverClass} rounded-lg`}
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
      </Link>
    </div>
  );
}
