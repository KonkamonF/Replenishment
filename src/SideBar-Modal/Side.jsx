import { NavLink } from "react-router-dom";

const baseClass =
  "p-3 w-full text-left transition duration-150 ease-in-out block font-medium tracking-wide text-sm";
const hoverClass = "hover:bg-gray-300 hover:text-[#640037]";
const activeClass = "text-[#640037] bg-gray-200 ";
const inactiveClass = "text-gray-700 rounded-r-lg";

export default function Side() {
  const role = localStorage.getItem("role"); // ⭐ ดึง role จาก localStorage

  const getNavLinkClass = ({ isActive }) => {
    return `${baseClass} ${hoverClass} rounded-l-full p-2 ml-5 ${
      isActive ? activeClass : inactiveClass
    }`;
  };

  return (
    <div className="flex flex-col py-4">

      {/* Dashboard — เห็นทุก role */}
      <NavLink to="/" className={getNavLinkClass}>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span>Dashboard</span>
        </div>
      </NavLink>

      {/* Trade: Role TradeAdmin + SuperAdmin */}
      {(role === "TradeAdmin" || role === "SuperAdmin") && (
        <NavLink to="/trade-admin" className={getNavLinkClass}>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5h6"></path>
            </svg>
            <span>Trade</span>
          </div>
        </NavLink>
      )}

      {/* Key Account: Role KeyAc + SuperAdmin */}
      {(role === "KeyAc" || role === "SuperAdmin") && (
        <NavLink to="/key-admin" className={getNavLinkClass}>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-8-4l8 4m0-10l8 4m-8-4v10"></path>
            </svg>
            <span>Key Account</span>
          </div>
        </NavLink>
      )}

      {/* Key Forecast: Role KeyAc + SuperAdmin */}
      {(role === "KeyAc" || role === "SuperAdmin") && (
        <NavLink to="/key-fc" className={getNavLinkClass}>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-8-4l8 4m0-10l8 4m-8-4v10"></path>
            </svg>
            <span>Key Forecast</span>
          </div>
        </NavLink>
      )}

    </div>
  );
}
