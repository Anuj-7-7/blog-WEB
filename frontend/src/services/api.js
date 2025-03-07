import axios from "axios";

// Set the base URL for all API requests
const API = axios.create({
  baseURL: "https://blog-backend-q3jz.onrender.com/api",
  withCredentials: true, // if you need to send cookies along
});

// Automatically attach the token from localStorage to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Use "token" as the consistent key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
