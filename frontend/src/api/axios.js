// src/api/axios.js

import axios from "axios";

const API = axios.create({
  baseURL: "https://sweet-shop-management-production-c8ae.up.railway.app/api",
  timeout: 10000, // 10 second timeout
});

// ─────────────────────────────────────────────
// Attach token to every request
// ─────────────────────────────────────────────

API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

// ─────────────────────────────────────────────
// Handle API errors globally
// ─────────────────────────────────────────────

API.interceptors.response.use(

  // Success
  (response) => response,

  // Error
  (error) => {

    const status =
      error.response?.status;

    const message =
      error.response?.data?.message;

    // ── Network / timeout error ─────────────────

    if (!error.response) {

      error.userMessage =
        "Cannot reach the server. Check your connection.";

      return Promise.reject(error);
    }

    // ── Friendly status handling ───────────────

    switch (status) {

      case 400:

        error.userMessage =
          message ||
          "Invalid request. Check your input.";

        break;

      case 401:

        error.userMessage =
          "Your session expired. Please log in again.";

        // Clear session
        localStorage.removeItem("token");

        localStorage.removeItem("user");

        // Avoid redirect loop
        const currentPath =
          window.location.pathname;

        const isAuthPage =
          currentPath === "/login" ||
          currentPath === "/register";

        if (!isAuthPage) {

          // Save current route
          sessionStorage.setItem(
            "redirectAfterLogin",
            currentPath
          );

          // Redirect
          window.location.href =
            "/login";
        }

        break;

      case 403:

        error.userMessage =
          "You don't have permission to do that.";

        console.warn(
          "Access forbidden:",
          message
        );

        break;

      case 404:

        error.userMessage =
          message ||
          "Item not found.";

        break;

      case 409:

        error.userMessage =
          message ||
          "A conflict occurred. This item may already exist.";

        break;

      case 422:

        error.userMessage =
          message ||
          "Validation failed. Check your input.";

        break;

      case 500:

        error.userMessage =
          "Server error. Please try again in a moment.";

        console.error(
          "Server error:",
          status,
          message
        );

        break;

      case 503:

        error.userMessage =
          "Server is temporarily unavailable. Try again soon.";

        console.error(
          "Service unavailable:",
          status,
          message
        );

        break;

      default:

        error.userMessage =
          message ||
          "Something went wrong. Please try again.";
    }

    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
// Helper — get clean user-facing error message
// ─────────────────────────────────────────────

export const getErrorMessage = (error) => {

  return (
    error?.userMessage ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
  );
};

export default API;