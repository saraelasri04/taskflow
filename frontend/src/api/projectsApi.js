import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// token auto attach
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;

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