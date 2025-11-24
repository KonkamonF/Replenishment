import { toast } from "react-toastify";

export function handleAuthError(error, navigate) {
  if (error.response?.status === 401) {
    toast.error("Session expired, please login again.");
    localStorage.clear();
    navigate("/login");
    return true;
  }
  return false;
}
