import { fetchDashboard } from '../api/dashboardApi.js';

export async function renderDashboard() {
  const app = document.getElementById('app');

  // Affichage pendant le chargement
  app.innerHTML = `
    <div class="container">
      <p>Chargement du tableau de bord...</p>
    </div>
  `;

  try {
    // Un seul appel Axios
    const response = await fetchDashboard();
    const {
      activeProjects,
      totalAssigned,
      totalDone,
      totalLate,
      inProgressTasks,
    } = response.data.data;

    app.innerHTML = `
      <div class="container">

        <div class="dashboard-header">
          <h1>Tableau de bord</h1>
          <button id="btn-projects">Voir mes projets</button>
        </div>

        <!-- Métriques -->
        <div class="metrics">
          <div class="metric-card">
            <span class="metric-value">${activeProjects}</span>
            <span class="metric-label">Projets actifs</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">${totalAssigned}</span>
            <span class="metric-label">Tâches assignées</span>
          </div>
          <div class="metric-card metric-success">
            <span class="metric-value">${totalDone}</span>
            <span class="metric-label">Tâches terminées</span>
          </div>
          <div class="metric-card metric-danger">
            <span class="metric-value">${totalLate}</span>
            <span class="metric-label">Tâches en retard</span>
          </div>
        </div>

        <!-- Tâches en cours -->
        <h2>Tâches en cours</h2>
        <div id="in-progress-list">
          ${inProgressTasks.length === 0
            ? '<p class="empty">Aucune tâche en cours.</p>'
            : inProgressTasks.map(task => `
              <div class="task-card">
                <div class="task-info">
                  <h3>${task.title}</h3>
                  <span class="project-name">
                    ${task.project?.title || 'Projet inconnu'}
                  </span>
                  ${task.deadline
                    ? `<span class="deadline">
                        Deadline : ${new Date(task.deadline).toLocaleDateString('fr-FR')}
                       </span>`
                    : ''
                  }
                </div>
                <span class="badge priority-${task.priority}">
                  ${task.priority}
                </span>
              </div>
            `).join('')
          }
        </div>

      </div>
    `;

    // Bouton retour projets
    document.getElementById('btn-projects').addEventListener('click', () => {
      import('./ProjectList.js').then(m => m.renderProjectList());
    });

  } catch (err) {
    app.innerHTML = `
      <div class="container">
        <p class="error">
          Erreur : ${err.response?.data?.message || err.message}
        </p>
      </div>
    `;
  }
}