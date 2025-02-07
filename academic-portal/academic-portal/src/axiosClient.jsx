import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json", // Ensure JSON format
  },
});

// Request Interceptor: Attach Token from sessionStorage
axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("ACCESS_TOKEN"); // Get token from sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle API Errors
axiosClient.interceptors.response.use(
  (response) => response, // Pass successful response directly
  (error) => {
    const { response } = error;

    if (response) {
      if (response.status === 401) {
        // Token expired or unauthorized access
        sessionStorage.removeItem("ACCESS_TOKEN"); // Remove token from sessionStorage

        // If a logout function is provided, call it
        if (typeof window.handleLogout === "function") {
          window.handleLogout();
        } else {
          console.warn("handleLogout function is not defined.");
          window.location.href = "/login"; // Fallback: Redirect to login
        }
      } else {
        console.error(`API Error (${response.status}):`, response.data);
      }
    } else {
      console.error("Network Error: No response received", error);
    }

    return Promise.reject(error); // Ensure errors are properly handled
  }
);

export default axiosClient;
