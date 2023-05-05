import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.fanflix.fantasticstudio.online',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;