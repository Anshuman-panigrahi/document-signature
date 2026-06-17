import axios from "axios";

const API = axios.create({
  baseURL: "https://document-signature-backend-ozs5.onrender.com",
});

export default API;
