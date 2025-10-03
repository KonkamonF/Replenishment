import React from "react";
import { Link, Outlet } from "react-router-dom"; // ใช้ Link แทน div สำหรับโลโก้
import Side from "./SideBar/Side";

export default function Appp() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        
        {/* --- Header / Navigation Bar --- */}
        <header className="bg-white shadow-md h-[64px] flex items-center justify-between px-6 z-10 sticky top-0 border-b border-pink-100">
          
          {/* Logo / System Title */}
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <svg 
                className="w-8 h-8 text-[#640037]" 
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
              Replenishment ADMIN
            </span>
          </Link>

          {/* User Profile / Notifications */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 hidden sm:block">
                Welcome, Admin User
            </div>
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#640037] font-semibold cursor-pointer border-2 border-pink-300">
              AD
            </div>
          </div>
        </header>
        
        {/* --- Main Layout: Sidebar and Content --- */}
        <div className="flex">
          
          {/* Sidebar */}
          <div className="min-h-screen bg-white w-[250px] shadow-lg sticky top-0 pt-4 hidden md:block">
            <Side />
          </div>
          
          {/* Main Content Area */}
          <main className="p-6 flex-1 max-w-full">
            <Outlet />
          </main>
        </div>
        
      </div>
    </>
  );
}