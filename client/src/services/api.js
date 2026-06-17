import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://document-signature-backend-ozs5.onrender.com",
});

export default API;
