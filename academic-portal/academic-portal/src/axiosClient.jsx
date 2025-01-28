import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api',
});

axiosClient.interceptors.request.use((config) => {
  // Fetch token from sessionStorage (consistent with ContextProvider)
  const token = sessionStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      const { response } = error;
      if (response && response.status === 401) {
        sessionStorage.removeItem("ACCESS_TOKEN"); // Remove token from sessionStorage on 401 error
      }
    } catch (err) {
      console.error("Error handling 401:", err);
    }
    throw error;
  }
);

export default axiosClient;
