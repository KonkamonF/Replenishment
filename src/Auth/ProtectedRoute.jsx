import React from "react";
import { Navigate } from "react-router-dom";

// ใช้ครอบ layout หลัก (Appp) เพื่อบังคับให้ต้อง login ก่อน
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  // ไม่มี token → เด้งไปหน้า login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
