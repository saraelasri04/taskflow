import { fetchProjects, deleteProject } from '../api/projectsApi.js';

// ─── État local de la page ────────────────────────────────────────────────────
let currentPage = 1;
const limit = 5;

// ─── Point d'entrée : affiche la page dans #app ───────────────────────────────
export async function renderProjectList() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h1>Mes projets</h1>
        <button id="btn-create">+ Nouveau projet</button>
      </div>
      <div id="projects-list">Chargement...</div>
      <div id="pagination"></div>
    </div>
  `;

  // Bouton créer
  document.getElementById('btn-create').addEventListener('click', () => {
    import('./ProjectForm.js').then(m => m.renderProjectForm(null));
  });

  await loadProjects();
}

// ─── Charge et affiche les projets ───────────────────────────────────────────
async function loadProjects() {
  const listEl       = document.getElementById('projects-list');
  const paginationEl = document.getElementById('pagination');

  try {
    const response   = await fetchProjects(currentPage, limit);
    const { data, pagination } = response.data;

    if (data.length === 0) {
      listEl.innerHTML = '<p class="empty">Aucun projet pour le moment.</p>';
      paginationEl.innerHTML = '';
      return;
    }

    // ─── Affiche les cartes projets ───────────────────────────────────────────
    listEl.innerHTML = data.map(project => `
      <div class="project-card">
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description || 'Aucune description'}</p>
          <span class="badge badge-${project.status.replace(' ', '-')}">
            ${project.status}
          </span>
          ${project.deadline
            ? `<span class="deadline">Deadline : ${new Date(project.deadline).toLocaleDateString('fr-FR')}</span>`
            : ''}
        </div>
        <div class="project-actions">
          <button class="btn-edit" data-id="${project._id}">Modifier</button>
          <button class="btn-delete" data-id="${project._id}" data-title="${project.title}">Supprimer</button>
        </div>
      </div>
    `).join('');

    // ─── Pagination ───────────────────────────────────────────────────────────
    paginationEl.innerHTML = `
      <button id="btn-prev" ${currentPage === 1 ? 'disabled' : ''}>Précédent</button>
      <span>Page ${pagination.page} / ${pagination.totalPages}</span>
      <button id="btn-next" ${currentPage >= pagination.totalPages ? 'disabled' : ''}>Suivant</button>
    `;

    // Événements pagination
    document.getElementById('btn-prev')?.addEventListener('click', () => {
      if (currentPage > 1) { currentPage--; loadProjects(); }
    });
    document.getElementById('btn-next')?.addEventListener('click', () => {
      if (currentPage < pagination.totalPages) { currentPage++; loadProjects(); }
    });

    // Événements modifier
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        import('./ProjectForm.js').then(m => m.renderProjectForm(btn.dataset.id));
      });
    });

    // Événements supprimer
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        import('./ProjectDelete.js').then(m =>
          m.renderProjectDelete(btn.dataset.id, btn.dataset.title)
        );
      });
    });

  } catch (err) {
    listEl.innerHTML = `<p class="error">Erreur : ${err.response?.data?.message || err.message}</p>`;
  }
}