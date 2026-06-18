import axios from "axios";

let API_URL = import.meta.env.VITE_API_URL || "https://document-signature-backend-ezs5.onrender.com";

// Force correct production backend URL to avoid old/incorrect environment variables in Vercel
if (API_URL.includes("ozs5.onrender.com") || !API_URL) {
  API_URL = "https://document-signature-backend-ezs5.onrender.com";
}

console.log("[API] Using backend URL:", API_URL);

const API = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout (Render free tier can be slow on cold start)
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't redirect on login/register endpoints (they naturally return 401 for bad credentials)
    const isAuthEndpoint = error.config?.url?.includes("/api/auth/");
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Token expired or invalid — clear and redirect to login page (route is "/")
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
