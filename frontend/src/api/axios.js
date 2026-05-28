// src/api/axios.js

import axios from "axios";

// Create a custom Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend base URL
});

// This runs BEFORE every request is sent
// It reads the token from localStorage and adds it to the headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;