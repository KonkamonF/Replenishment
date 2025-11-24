import React from "react";
import { Navigate } from "react-router-dom";

// ใช้ครอบแต่ละหน้า ตาม role ที่อนุญาต เช่น ["SuperAdmin", "KeyAc"]
export default function RoleGuard({ allowedRoles = [], children }) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ถ้ากำหนด allowedRoles แล้ว role ตอนนี้ไม่อยู่ในนั้น → ไม่ให้เข้า
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // จะเด้งไปหน้า login หรือหน้าอื่นก็ได้ตามใจ
    return <Navigate to="/login" replace />;
  }

  return children;
}
