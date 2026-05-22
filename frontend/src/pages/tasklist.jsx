import { useState, useEffect } from "react";
import axios from "axios";

export default function TaskList({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const token = localStorage.getItem("token");

  async function fetchTasks() {
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (status) params.status = status;
    if (priority) params.priority = priority;

    const res = await axios.get(`http://localhost:5000/api/projects/${projectId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });

    setTasks(res.data.data);
    setTotal(res.data.total);
    setTotalPages(res.data.totalPages);
  }

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId, page, status, priority]);

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchTasks();
  }

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={handleSearch}
        />
        <button type="submit">Chercher</button>
      </form>

      <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
        <option value="">Tous les statuts</option>
        <option value="à faire">À faire</option>
        <option value="en cours">En cours</option>
        <option value="terminé">Terminé</option>
      </select>

      <select value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }}>
        <option value="">Toutes les priorités</option>
        <option value="haute">Haute</option>
        <option value="moyenne">Moyenne</option>
        <option value="basse">Basse</option>
      </select>

      <p>Total: {total} tâches</p>

      {tasks.map(task => (
        <div key={task._id} style={{ border: "1px solid #ccc", margin: "8px", padding: "8px" }}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <span>{task.priority}</span> — <span>{task.status}</span>
          {task.assignedTo && <p>Assigné à: {task.assignedTo.name}</p>}
        </div>
      ))}

      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{ fontWeight: p === page ? "bold" : "normal", margin: "4px" }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}