import axios from "axios";
import { doLogout, getToken } from "@/contexts/Auth";

// 🌿 Switchable base URL (adjust as needed)
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// 🕊️ Public axios instance (no token)
export const myAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 🔒 Private axios instance (requires token)
export const privateAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/* -------------------------------------------------
   🔐 Request Interceptor — Attaches JWT Token
------------------------------------------------- */
privateAxios.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      console.warn("⚠️ No auth token found. Proceeding without credentials.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------------------------------------
   🌐 Response Interceptor — Handles Global Errors
------------------------------------------------- */
privateAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.warn("🌱 Network issue detected — app is likely offline.");
      // Optionally trigger a global toast or offline screen here
    }

    if (error.response?.status === 401) {
      console.warn("🔒 Session expired. Logging out user...");
      doLogout?.();
      // Optionally redirect to login if you’re using Next Router
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
