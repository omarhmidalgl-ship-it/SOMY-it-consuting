import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("somy_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("somy_token");
      if (window.location.pathname.startsWith("/dashboard")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
