// utils/authFetch.js

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("access_token");

  // -- แนบ Token อัตโนมัติ --
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const newOptions = {
    ...options,
    headers,
  };

  const response = await fetch(url, newOptions);

  // ----------- ตรวจจับ Token หมดอายุ / ไม่มีสิทธิ ----------- //
  if (response.status === 401 || response.status === 403) {
    console.warn("⛔ Token invalid (401/403). Logging out...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    // ป้องกัน redirect loop
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return response;
}
