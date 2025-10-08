import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const cookieValue = Cookies.get('token');
  if (cookieValue) {
    try {
      const parsed = JSON.parse(cookieValue);
      const token = parsed?.state?.token || cookieValue;
      config.headers['Authorization'] = `Bearer ${token}`;
    } catch {
      config.headers['Authorization'] = `Bearer ${cookieValue}`;
    }
  }
  return config;
});

export default axiosInstance;