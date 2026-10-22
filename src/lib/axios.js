import axios from 'axios'
import { logoutAndRedirect } from './api/authApi'
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: `${API_BASE}`,
})

// Add token from localStorage to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor (handle 403 errors)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // // token expired → clear and redirect
      // localStorage.removeItem("token");
      // window.location.href = "/login"; // force redirect
      logoutAndRedirect();
    }
    return Promise.reject(error);
  }
);

export default instance