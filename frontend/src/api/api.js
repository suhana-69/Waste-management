// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "/api" // in production, proxy to backend
      : "http://localhost:5000/api", // local dev
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
