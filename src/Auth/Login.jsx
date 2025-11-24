import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", {
        username,
        password,
      });

      // ตาม response model จาก backend:
      // access_token, token_type, username, role
      const {
        access_token,
        role,
        username: apiUsername,
      } = res.data;

      if (!access_token) {
        throw new Error("ไม่พบ access_token ใน response");
      }

      // 🔐 เก็บ token + role ไว้ให้ ProtectedRoute / RoleGuard ใช้
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", apiUsername || username);

      console.log("Login success:", { access_token, role, username });

      // 🎯 Redirect ตาม role (ต้องตรงกับ AppRoute / RoleGuard)
      if (role === "SuperAdmin") {
        navigate("/super-admin", { replace: true });
      } else if (role === "TradeAdmin") {
        navigate("/super-admin", { replace: true });
        // navigate("/trade-admin", { replace: true });
      } else if (role === "KeyAc") {
        navigate("/super-admin", { replace: true });
        // navigate("/key-admin", { replace: true });
      } else {
        // ถ้า role แปลก ๆ ก็ให้ไปหน้าแรกของ layout
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "ไม่สามารถเข้าสู่ระบบได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-lg p-10 w-96 space-y-5"
      >
        <h2 className="text-center text-xl font-bold">เข้าสู่ระบบ</h2>

        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}

        <input
          type="text"
          placeholder="ชื่อผู้ใช้"
          className="w-full border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="รหัสผ่าน"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className={`w-full p-2 rounded text-white font-bold ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
