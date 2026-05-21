import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Joint le JWT automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Un seul appel pour toutes les données du tableau de bord
export const fetchDashboard = () => api.get('/dashboard');