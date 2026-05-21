import axios from 'axios';

// Récupère le token JWT stocké par la fonctionnalité 1
const getToken = () => localStorage.getItem('token');

// Instance Axios configurée — toutes les requêtes partent vers le backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Intercepteur : joint automatiquement le JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Fonctions appelées depuis les pages ──────────────────────────────────────

// GET /api/projects?page=1&limit=10
export const fetchProjects = (page = 1, limit = 10) =>
  api.get(`/projects?page=${page}&limit=${limit}`);

// GET /api/projects/:id
export const fetchProjectById = (id) =>
  api.get(`/projects/${id}`);

// POST /api/projects
export const createProject = (data) =>
  api.post('/projects', data);

// PUT /api/projects/:id
export const updateProject = (id, data) =>
  api.put(`/projects/${id}`, data);

// DELETE /api/projects/:id
export const deleteProject = (id) =>
  api.delete(`/projects/${id}`);