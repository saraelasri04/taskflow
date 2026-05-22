
import API from "../api/api.js";

export async function renderDashboard() {

  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>Mes tâches</h1>
    <div id="mes-taches"></div>
  `;

  await chargerMesTaches();
}

async function chargerMesTaches() {

  const res = await API.get("/tasks?assignedTo=me");

  const container = document.getElementById("mes-taches");

  container.innerHTML = "";

  res.data.forEach(task => {

    container.innerHTML += `
      <div class="task-card">
        <h3>${task.titre}</h3>
        <p>${task.statut}</p>
        <p>${task.priorite}</p>
      </div>
    `;
  });
}
